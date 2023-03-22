import Button from "@/components/button";
import CreationForm from "@/components/creation-form";
import styled from "styled-components";
import {
  ContentCopy,
  Link as LinkIcon,
  Grade,
  ReadMore,
} from "@mui/icons-material";
import Title from "@/components/title";
import { useEffect, useState } from "react";
import typeWriter from "@/utils/typewriter";
import Link from "next/link";
import { useQuery } from "react-query";
import LoadingOverlay from "@/components/loading-overlay";
import { getCookie } from "@/utils/cookie";

export default function Index() {
  const [copied, setCopied] = useState(false);
  const { data, isLoading, error } = useQuery(
    "lastAdded",
    async () => {
      if (getCookie()?.noCookie) {
        console.log("NO COOKIE TO FETCH LAST, THROWING ...");
        return null;
      };
      console.log("USER FOUND. FETCHING LAST >>>");
      const lastUrl = await (await fetch("/api/urls/get/last")).json();
      if (lastUrl.error) {
        console.log("NO LAST URL, THROWING ...");
        return null;
      }
      console.log("LAST >>>");
      
      return lastUrl;
    },
    {
      onSuccess: () => {
        setCopied(false);
      },
    }
  );

  const jokeQuery = useQuery("joke", async () => {
    return (await fetch("https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Pun,Spooky?blacklistFlags=religious&format=txt")).text()
  }, {
    initialData: "Why don't chickens come to my site ? \nCuz they don't like it short!",
    refetchInterval: 30000,
  })

  useEffect(() => {
    setTimeout(() => {
      typeWriter();
    }, 1000);
  }, []);

  return (
    <StyledHome>
      <RoundButton title={(jokeQuery.data && !jokeQuery.error) ? jokeQuery.data : ""}>
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
      <ContentWrapper>
      {data && !error && (
        <LoadingOverlay loading={isLoading}>
          <Copyable copied={copied}>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(data.url);
                setCopied(true);
              }}
              disabled={copied}
            >
              <ContentCopy />
            </Button>
            <h4>{data.url}</h4>
            <Button>
            <Link href={"/dashboard"} style={{color: "inherit"}}>
              <ReadMore color={"inherit"}/>
            </Link>
            </Button>
          </Copyable>
        </LoadingOverlay>
      )}
        <CreationForm />
      </ContentWrapper>
      {
        false ? <h1>Yes</h1> : null
      }
    </StyledHome>
  );
}

const Copyable = styled.h3<{ copied?: boolean | unknown }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--padding-normal);
  padding: var(--padding-normal);
  box-shadow: ${({ theme }) => theme.shadow.primary};
  border-radius: var(--padding-normal);
  border: 0.2rem solid transparent;
  border-color: ${(props) => (props.copied ? "#00ff2f" : "transparent")};
  font-size: inherit;
  & h4 {
    -webkit-user-select: all;
    user-select: all;
  }
`;

const HomeTitle = styled(Title)`
  font-size: var(--fs-3xl);
  line-height: normal;
  color: ${({ theme }) => theme.textColor.primary};
  max-width: 50%;
  @media (max-width: 997px) {
    & {
      max-width: 80%;
    }
  }

  @media (max-width: 550px) {
    font-size: var(--fs-2xl);
    max-width: 100%;
}  
`;

const Nefor = styled.div`
  font-size: var(--fs-4xl);
  font-weight: bold;
  background-image: linear-gradient(90deg, #810094, #fb457f);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: 300ms ease-out;
  min-height: 130%;

  @media (max-width: 718px) {
      font-size: var(--fs-3xl);
}

@media (max-width: 550px) {
      font-size: var(--fs-2xl);
      text-align: center;
      align-self: center;
}
`;

const HomeText = styled.p`
  font-size: var(--fs-l);
  color: ${({ theme }) => theme.textColor.secondary};
  line-height: normal;
  letter-spacing: 0.05rem;
  max-width: 50%;
  @media (max-width: 997px) {
      max-width: 80%;
  }
  @media (max-width: 550px) {
    max-width: 100%;
  }
`;

const StyledHome = styled.section`
  padding: 5rem 0 2rem 2rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: var(--padding-gigant);
  @media (max-width: 550px) {
    padding: 5rem 0 1rem 1rem;
    text-align: center;
  }
`;

const RoundButton = styled(Button)`
  border: none;
  transform: rotateZ(-45deg);
  border-radius: 50%;
  aspect-ratio: 1;
  color: white;
  box-shadow: ${({ theme }) => theme.shadow.primary};
  & a {
    color: inherit;
  }
`;

const ContentWrapper = styled.div`
font-size: var(--fs-xl);
  padding: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  max-width: 50%;
  flex-direction: column;
  height: auto;
  gap: var(--padding-small);

  @media (max-width: 997px) {
      max-width: 80%;
      width: 80%;
  }
  @media (max-width: 550px) {
    width: 100%;
    font-size: var(--fs-normal);
  }
  
`;
