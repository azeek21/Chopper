import Urls from "@/components/urls";
import mongoClient from "@/db/connect";
import getUrls from "@/db/get-urls";
import getUser from "@/db/get-user";
import { URL_DATA_INTERFACE } from "@/db/models/url-model";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import { useQuery } from "react-query";
import styled from "styled-components";

export default function Dashboard({ urls }: { urls: URL_DATA_INTERFACE[] }) {
  const {data, isLoading, error} = useQuery<URL_DATA_INTERFACE[]>("urls", async () => {
    const fetchedUrls = await (await fetch('/api/urls/get/')).json();
    console.log("CLIENT SIDE URLS=>");
    console.log(fetchedUrls);
    
    if (fetchedUrls.error) {
      return [];
    }
    return fetchedUrls;
  }, {
    initialData: urls,
  })

  return (
      <StyledDashboard>
        {data && data.length > 0 && <Urls urls={data} />}
      </StyledDashboard>
  );
}

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
  console.log("SERVER SIDE URLS =>");
  console.log(urls);
  
  return {
    props: {
      urls: urls,
    },
  };
}

const StyledDashboard = styled.section`
  margin: auto auto auto auto;
  padding: 5rem var(--padding-normal) var(--padding-normal) var(--padding-normal);
`;
