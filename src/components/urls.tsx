import UrlItem from "./url-item";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";

export default function Urls() {
  const urls = useSelector((state: RootState) => state.urls);

  return (
    <StyledUrls>
      {urls.urls.length > 0 && urls.urls.map((url) => <UrlItem url={url} />)}
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
