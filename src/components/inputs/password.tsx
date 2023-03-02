import { useState } from "react";
import styled from "styled-components";
import Button from "../button";
import Input from "../input";

export default function PasswordField(props: any) {
    const [visible, setVisible] = useState(false)

  return (
    <StyledPasswordField as="div">
      <Input
        id="password"
        value={props.value || ""}
        name="password"
        placeholder=" "
        title="Any password, security is yours, who cares 🤷‍♂️"
        required={false}
        type={visible ? "text" : "password"}
        style={{paddingRight: "2rem"}}
        onChange={(ev) => {
          props.clickHandler(ev);
        }}
        autoComplete="new-password"
      />
    <label className="label" htmlFor="password"> Password </label>

      <span className="eye" onClick={() => {setVisible(!visible)}}>👁</span>
    </StyledPasswordField>
  );
}

const StyledPasswordField = styled(Input)`
  position: relative;
  padding: 0;
  border: none;
  &:hover{
    border: none;
  }
  & .eye {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

// id="limitinput" value={form?.password} name="password" onChange={changeHandler} placeholder=" " type={"password"}  required={false} autoComplete="new-password"
