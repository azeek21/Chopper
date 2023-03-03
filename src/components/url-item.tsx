import { URL_DATA_INTERFACE } from "@/db/models/url-model";
import {
  Link,
  Key,
  Visibility,
  VisibilityOff,
  LinkOff,
  ManageHistory,
} from "@mui/icons-material";
import { useState } from "react";
import { FormItemWrapper } from "./creation-form";
import Input from "./input";
import Button from "./button";

export default function UrlItem({ url }: { url: URL_DATA_INTERFACE }) {
    const [form, setForm] = useState(url);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const changeHandler = () => {

    }

  return (
    <>
    <h4>{form.from_url}</h4>
      {/* PASSWORD INPUT */}
    
      <FormItemWrapper>
        <Input
          id="password"
          value={form.password || ""}
          name="password"
          placeholder=" "
          title="Any password, security is yours, who cares 🤷‍♂️"
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
        <div
          onClick={() => {
            setPasswordVisible((visible) => !visible);
          }}
        >
          <Button type="button">
            {passwordVisible ? <Visibility /> : <VisibilityOff />}
          </Button>
        </div>
        <label className="label" htmlFor="password">
          {" "}
          Password{" "}
        </label>
      </FormItemWrapper>

      {/* LIMIT INPUT */}
      <FormItemWrapper>
        <Input
          type={"number"}
          id="limit"
          name="limit"
          value={form.limit || ""}
          onChange={changeHandler}
          placeholder=" "
          title="Url will be disabled after being used for N times."
        />
        <label className="label" htmlFor="limit">
          {" "}
          First N people can use this link{" "}
        </label>
        <span>
          {" "}
          <LinkOff />{" "}
        </span>
      </FormItemWrapper>

      {/* TIMEOUT INPUT */}
      <FormItemWrapper>
        <Input
          type={"date"}
          id="timeout"
          name="timeout"
          value={form.timeout || ""}
          onChange={changeHandler}
          placeholder=" "
          title="Url will be disabled after this date."
        />
        <label className="label" htmlFor="timeout">
          {" "}
          Disable after this date{" "}
        </label>
        <span>
          {" "}
          <ManageHistory />{" "}
        </span>
      </FormItemWrapper>
    </>
  );
}
