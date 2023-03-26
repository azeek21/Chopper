import Button from "@/components/button";
import { FormItemWrapper } from "@/components/creation-form";
import Input from "@/components/input";
import mongoClient from "@/db/connect";
import getUser from "@/db/get-user";
import UrlModel, { URL_DATA_INTERFACE } from "@/db/models/url-model";
import { getRetryObject } from "@/utils/retries";
import {
  ArrowRightAlt, Key, Lock as LockIcon,
  LockClock,
  RepeatOn as RepeatOnIcon, Visibility,
  VisibilityOff
} from "@mui/icons-material";
import dayjs from "dayjs";
import { HydratedDocument } from "mongoose";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";

type RedirectToPropsType = {
  id: string;
  error?: boolean;
  message?: string;
  cools_at?: number;
  retries_left?: number;
};

export default function RedirectTo(props: RedirectToPropsType) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [leftTime, setLeftTime] = useState(() => {
    if (props.cools_at) {
      return props.cools_at - dayjs().unix();
    }
    return 0;
  });

  const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
    setPassword(ev.target.value);
  };

  useEffect(() => {
    // cooldown timer countdown
    let i = leftTime;
    if (leftTime) {
      const leftTimeTimeout = setInterval(() => {
        if (i >= 0) {
          i--;
          setLeftTime(i);
        } else {
          clearInterval(leftTimeTimeout);
          setLeftTime(0);
        }
      }, 1000);
    }
  }, []);

  return (
    <StyledRedirectTo>
      <StyledForm
        method="POST"
        action={"/api/redirect/" + props.id}
        disabled={leftTime > 0}
      >
        <h2>
          <LockIcon /> Locked
        </h2>
        <StyledInfoContainer>
          {props.retries_left && (
            <div
              title={
                "You will be locked after " +
                props.retries_left +
                " failed attempts"
              }
            >
              <p>
                <RepeatOnIcon /> {props.retries_left}/3 left{" "}
              </p>
            </div>
          )}

          {leftTime > 0 && (
            <div
              title={
                "You will be able to retry after " + leftTime + " seconds..."
              }
            >
              <LockClock />
              <p>{leftTime}s</p>
            </div>
          )}
        </StyledInfoContainer>

        <FormItemWrapper>
          <Input
            disabled={leftTime > 0}
            id="password"
            value={password || ""}
            name="password"
            placeholder=" "
            title="Enter password to use the URL"
            required={false}
            type={passwordVisible ? "text" : "password"}
            style={{ paddingRight: "2rem" }}
            onChange={changeHandler}
            autoComplete="new-password"
          />
          <span>
            {" "}
            <Key />{" "}
          </span>
          <PasswordButtonsContainer>
            {/* VISIBILITY */}
            <Button
              type="button"
              onClick={() => {
                setPasswordVisible((visible) => !visible);
              }}
            >
              {passwordVisible ? <Visibility /> : <VisibilityOff />}
            </Button>

            {/* POST */}
            <Button active={!(leftTime > 0)}>
              <ArrowRightAlt />
            </Button>
          </PasswordButtonsContainer>
          <label className="label" htmlFor="password">
            {" "}
            Enter Password{" "}
          </label>
        </FormItemWrapper>
        <FormItemWrapper>
          <label>
            {" "}
            Remember me
            <input
              type={"checkbox"}
              name="remember"
              disabled={leftTime > 0}
              title="If enabled, you don't have to type the password next time."
            />
          </label>
        </FormItemWrapper>
      </StyledForm>
    </StyledRedirectTo>
  );
}

const StyledForm = styled.form<{ disabled?: Boolean }>`
  background-color: rgba(28, 0, 33, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--padding-big);
  & input {
    border-radius: var(--padding-big);
    box-shadow: ${({ theme }) => theme.shadow.secondary};
  }
  box-shadow: ${({ theme }) => theme.shadow.primary};
  padding: var(--padding-big);
  border-radius: var(--padding-big);
  ${({ disabled }) =>
    disabled ? "border: 0.15rem solid rgba(160, 0, 0, 1)" : ""}
  @media (max-width: 550px) {
    font-size: 90%;
  }
`;

const StyledInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 80%;
`;

const PasswordButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--padding-normal);
  @media (max-width: 550px) {
    gap: var(--padding-small);
    svg {
      font-size: 120%;
    }
  }
`;

const StyledRedirectTo = styled.section`
  color: white;
  padding-top: 5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: flex-start;
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let dest_id = context.query.from_url;

  if (!dest_id || (typeof dest_id == "object" && dest_id.length > 1)) {
    return {
      notFound: true,
    };
  }

  dest_id = dest_id[0];

  if (dest_id) {
    await mongoClient();
    const doc = await UrlModel.findOne<HydratedDocument<URL_DATA_INTERFACE>>({
      urlid: dest_id,
    }).exec();

    const now = dayjs().unix();

    if (
      !doc ||
      (doc.timeout && now >= doc.timeout) ||
      (doc.limit && doc.clicks >= doc.limit)
    ) {
      return {
        notFound: true,
      };
    }

    // if url is password protected return password form;
    if (doc.password) {
      const user = await getUser(context.req as NextApiRequest); // we only need cookies so it's ok.
      // check if user ever accessed url with remember me option turned on;
      if (!user) {
        return {
          props: { id: doc.urlid },
        };
      }

      if (user.has_access_to && user.has_access_to.includes(dest_id)) {
        return {
          redirect: {
            destination: doc.to_url,
            permanent: false,
          },
        };
      }

      const retryObject = getRetryObject(user, doc.urlid);

      if (!retryObject) {
        return {
          props: {
            id: doc.urlid,
          },
        };
      }

      return {
        props: {
          id: doc.urlid,
          cools_at: retryObject.cools_at || null,
          retries_left: retryObject.max_retry_count - retryObject.count,
        },
      };
    }

    doc.clicks = doc.clicks + 1;
    await doc.save();
    return {
      redirect: {
        destination: doc.to_url,
        permanent: false,
      },
    };
  }

  return {
    notFound: true,
  };
}
