import mongoClient from "@/db/connect";
import UrlModel, { URL_DATA_INTERFACE } from "@/db/models/url-model";
import { HydratedDocument } from "mongoose";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import dayjs from "dayjs";
import styled from "styled-components";
import { ChangeEvent, useEffect, useState } from "react";
import { FormItemWrapper } from "@/components/creation-form";
import Input from "@/components/input";
import Button from "@/components/button";
import {
  Key,
  Visibility,
  VisibilityOff,
  ArrowRightAlt,
} from "@mui/icons-material";
import getUser from "@/db/get-user";
import { getRetryObject, isAllowable } from "@/utils/retries";

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

  console.log(props);

  const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
    setPassword(ev.target.value);
  };

  useEffect(() => {
    // cooldown timer countdown
    if (leftTime) {
      const leftTimeTimeout = setInterval(() => {
        if (leftTime >= 0) {
          setLeftTime((old) => old - 1);
        } else {
          clearInterval(leftTimeTimeout);
          setLeftTime(0);
        }
      }, 1000);
    }
  }, []);

  return (
    <StyledRedirectTo>
      <h2>
        This URL has been secured with password, please enter your password:
      </h2>
      <form method="POST" action={"/api/redirect/" + props.id}>
        {props.retries_left && (
          <p> {props.retries_left} tries left </p>
        )}
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
            <Button>
              <ArrowRightAlt />
            </Button>
          </PasswordButtonsContainer>
          <label className="label" htmlFor="password">
            {" "}
            Password{" "}
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
        {leftTime > 0 && (
          <p>
            Too many failed treis. Please, wait {leftTime} seconds before trying
            again...
          </p>
        )}
      </form>
    </StyledRedirectTo>
  );
}

const PasswordButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--padding-normal);
`;

const StyledRedirectTo = styled.section`
  background-color: rgb(28, 0, 33);
  min-height: 100vh;
  color: white;
  padding-top: 5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: flex-start;
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let dest_id = context.query.from_url;

  // check query and parse dest_id (url.urlid);
  if ( !(dest_id && typeof(dest_id) == "object" && dest_id.length > 1) ) {
    return {
      notFound: true,
    }
  };

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
      const user = await getUser(context.req as NextApiRequest); // we only need cookies so I did req as NextApiRequest, Not recommended way;
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
          }
        }
      }

      const retryObject = getRetryObject(user, doc.urlid);
      console.log("RETRY OBJECT: ", retryObject);

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
    console.log(doc);
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
