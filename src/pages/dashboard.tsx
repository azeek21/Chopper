import Button from "@/components/button";
import CreationForm from "@/components/creation-form";
import Urls from "@/components/urls";
import mongoClient from "@/db/connect";
import getUrls from "@/db/get-urls";
import getUser from "@/db/get-user";
import { URL_DATA_INTERFACE } from "@/db/models/url-model";
import { AddBox, DisabledByDefault } from "@mui/icons-material";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

export default function Dashboard({ urls }: { urls: URL_DATA_INTERFACE[] }) {
  const { data, isLoading, error } = useQuery<URL_DATA_INTERFACE[]>(
    "urls",
    async () => {
      const fetchedUrls = await (await fetch("/api/urls/get/")).json();

      if (fetchedUrls.error) {
        return [];
      }
      return fetchedUrls;
    },
    {
      initialData: urls,
    }
  );

  const [addExpanded, setAddExpanded] = useState(false);

  return (
    <StyledDashboard>
      <StyledCreationFormContainer>
        <Button
          onClick={() => {
            setAddExpanded((expanded) => !expanded);
          }}
        >
          {" "}
          {addExpanded ? <DisabledByDefault /> : <AddBox />}{" "}
        </Button>
        {addExpanded && <CreationForm />}
      </StyledCreationFormContainer>
      {data && data.length > 0 && <Urls urls={data} />}
    </StyledDashboard>
  );
}

const StyledCreationFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: center;
  gap: var(--padding-small);
  backdrop-filter: blur(2px) brightness(75%);
  border-radius: var(--padding-normal);
  box-shadow: ${({ theme }) => theme.shadow.primary};
  position: fixed;
  bottom: 2rem;
  right: 7rem;
  height: auto;
  border: 0.1rem solid ${({ theme }) => theme.textColor.pink};
  z-index: 999;
  padding: var(--padding-big);
  margin: 0;
  & div {
    margin: 0;
  }

  @media (max-width: 550px) {
    right: 2rem;
  }
  @media (max-width: 350px) {
    padding: var(--padding-normal);
    right: 1.8rem;
  }
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  await mongoClient();

  const user = await getUser(context.req as NextApiRequest);
  if (!user) {
    return {
      props: {
        urls: null,
      },
    };
  }

  const urls = await getUrls(context.req as NextApiRequest, user);

  return {
    props: {
      urls: urls,
    },
  };
}

const StyledDashboard = styled.section`
  position: relative;
  margin: auto;
  padding: 5rem var(--padding-normal) var(--padding-normal)
    var(--padding-normal);
`;
