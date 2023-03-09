import Urls from "@/components/urls";
import mongoClient from "@/db/connect";
import getUrls from "@/db/get-urls";
import getUser from "@/db/get-user";
import { URL_DATA_INTERFACE } from "@/db/models/url-model";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import styled from "styled-components";

export default function Dashboard({ urls }: { urls: URL_DATA_INTERFACE[] }) {
  console.log(urls);

  return (
      <StyledDashboard>
        {urls && urls.length > 0 && <Urls urls={urls} />}
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

  return {
    props: {
      urls: urls,
    },
  };
}

const StyledDashboard = styled.section`
  margin: auto auto auto auto;
  padding-top: 5rem;
`;
