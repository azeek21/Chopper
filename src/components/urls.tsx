import UrlItem from "./url-item";
import styled from "styled-components";
import { URL_DATA_INTERFACE } from "@/db/models/url-model";

export default function Urls({urls}: {urls: URL_DATA_INTERFACE[]} ) {

  return (
    <StyledUrls>
      {urls.length > 0 && urls.map((url) => <UrlItem url={url} />)}
    </StyledUrls>
  );
}

const StyledUrls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  gap: var(--padding-big);
`;
