import Button from "@/components/button";
import CreationForm from "@/components/creation-form";
import styled from "styled-components";
import { ContentCopy, Link as LinkIcon, Grade } from "@mui/icons-material";
import Title from "@/components/title";
import { useEffect, useState } from "react";
import typeWriter from "@/utils/typewriter";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Link from "next/link";
import { url } from "inspector";

export default function Index() {
  const urls = useSelector((state: RootState) => state.urls);

  useEffect(() => {
    setTimeout(() => {
      typeWriter();
    }, 1000);
  }, []);

  return (
    <StyledHome>
      <RoundButton title="Send me a start in github">
        <Link href="https://github.com/azeek21/url_shortener_practice">
          <Grade />
        </Link>
      </RoundButton>
      <HomeTitle>A SIMPLE LINK BUT A POWERFUL TOOL FOR</HomeTitle>
      <Nefor id="demo">Everyone ?</Nefor>
      <HomeText>
        Our tool allows you seamlessly create and track your links with simple
        and easy-to-remember yet powerfull links and provide your customers a
        unique toilered experinece
      </HomeText>
      <CreationForm />
      { urls.urls.length > 0 
          && 
        <Copyable> 
          <Button onClick={ () => {
            navigator.clipboard.writeText(urls.urls[urls.urls.length - 1].url);
            alert(urls.urls[urls.urls.length - 1].url + " COPIED ✅")
          }}>
            <ContentCopy/>
          </Button>
          {urls.urls[urls.urls.length -1].url} <Link href={"/dashboard"}>>>></Link>
        </Copyable>
      }
    </StyledHome>
  );
}

const Copyable = styled.h3`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--padding-normal);
`

const HomeTitle = styled(Title)`
  font-size: var(--fs-3xl);
  line-height: normal;
  color: ${({ theme }) => theme.textColor.primary};
  max-width: 70%;
`;

const Nefor = styled.div`
  font-size: var(--fs-4xl);
  font-weight: bold;
  background-image: linear-gradient(90deg, #810094, #fb457f);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: 300ms ease-out;
  min-height: 100%;
`;

const HomeText = styled.p`
  font-size: var(--fs-l);
  color: ${({ theme }) => theme.textColor.secondary};
  line-height: normal;
  letter-spacing: 0.05rem;
  max-width: 60%;
`;

const StyledHome = styled.section`
  padding: 5rem 0 2rem 2rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  max-width: 50%;
  gap: 1rem;
`;

const RoundButton = styled(Button)`
  border: none;
  transform: rotateZ(-45deg);
  border-radius: 50%;
  aspect-ratio: 1;
  color: white;
  box-shadow: ${({ theme }) => theme.shadow.primary};
  & a {
    color: inherit
  }
`;

