import mongoClient from "@/db/connect";
import UrlModel, { URL_DATA_INTERFACE } from "@/db/models/url-model";
import { HydratedDocument } from "mongoose";
import { GetServerSidePropsContext } from "next";
import dayjs from "dayjs";
import styled from "styled-components";
import { ChangeEvent, useEffect, useState } from "react";
import { FormItemWrapper } from "@/components/creation-form";
import Input from "@/components/input";
import Button from "@/components/button";
import { Key, Visibility, VisibilityOff, ArrowRightAlt } from "@mui/icons-material";

export default function RedirectTo({id}: {id: URL_DATA_INTERFACE}) {

  const [ passwordVisible, setPasswordVisible ] = useState(false);
  const [password, setPassword] = useState("");

  const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
    setPassword(ev.target.value);
  }

  useEffect(() => {
    const body = document.querySelector("body");
  }, []);

  return (
    <StyledRedirectTo>
      <h2>
        This URL has been secured with password, please enter your password:
      </h2>
      <form method="POST" action={"/api/redirect/" + id}>
      <FormItemWrapper >
        <Input
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
          <Button type="button" onClick={() => {setPasswordVisible(visible => !visible)}} >
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
        <label> Remember me
          <input type={"checkbox"} name="remember"/>
        </label>
      </FormItemWrapper>
      </form>
    </StyledRedirectTo>
  );
}

const PasswordButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--padding-normal);
`

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
  const dest_id = context.query.from_url;
  console.log(dest_id);

  if (dest_id) {
    await mongoClient();
    const doc = await UrlModel.findOne<HydratedDocument<URL_DATA_INTERFACE>>({
      urlid: dest_id[0],
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

    doc.clicks = doc.clicks + 1;
    if (doc.password) {
      return {
        props: {id: doc.urlid},
      };
    }
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
