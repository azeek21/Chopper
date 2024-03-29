import Cookies from "js-cookie";
import { useState } from "react";
import styled, { keyframes } from "styled-components";
import Button from "./button";
import LoadingOverlay from "./loading-overlay";

const PopupAnimation = keyframes`
    0% {
        width: 0;
        border-radius: 50%;
    }

    40% {
        border-radius: var(--padding-gigant);
    }

    100% {
        bottom: 2rem;
        border-radius: var(--padding-gigant);
        width: 60%;
    }
`;

export default function Cookie() {
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const agreeHandler = async () => {
    setLoading(true);
    const res = await (await fetch("/api/new-user")).json();
    setLoading(false);
    setVisible(false);
  };

  const disagreeHandler = async () => {
    Cookies.set("no-cookie", "true", {
      path: "/",
      expires: 360,
    });
    setVisible(false);
  };

  if (!visible) {
    return <></>;
  }

  return (
    <StyledCookie>
      <h4>Want some chocolate ?</h4>
      <CookieText>
        Oh, no. I just ran out of chocolates :(. But I can give you a handfull
        of cookies. If you agree, you`&apos;`ll get to manage your URL`&apos;`s.
        Othervise, you`&apos;`ll lose control over your URL`&apos;`s after you
        create them.
      </CookieText>
      <LoadingOverlay loading={loading}>
        <ButtonContainer>
          <Button
            onClick={() => {
              disagreeHandler();
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              agreeHandler();
            }}
            active={true}
          >
            Agree
          </Button>
        </ButtonContainer>
      </LoadingOverlay>
    </StyledCookie>
  );
}

const CookieText = styled.p`
  color: ${({ theme }) => theme.textColor.secondary};
  font-size: var(--fs-sm);
  line-height: normal;
  letter-spacing: 0.05rem;
`;

const StyledCookie = styled.div`
  height: auto;
  width: auto;
  min-width: 50%;
  top: 50%;
  overflow: hidden;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  backdrop-filter: blur(3px);
  margin: 0 auto;
  padding: var(--padding-big);
  box-shadow: ${({ theme }) => theme.shadow.primary};
  border: 0.1rem solid ${({ theme }) => theme.backgroundColor.pink};
  animation: ${PopupAnimation} 2s ease-out 1;
  border-radius: var(--padding-gigant);
  z-index: 999999;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: var(--paddding-small);
  gap: var(--padding-big);
`;
