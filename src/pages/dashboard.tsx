import Urls from "@/components/urls";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import styled from "styled-components";

export default function Dashboard() {
  const urls = useSelector((state: RootState) => state.urls);

  return (
    <StyledDashboard>
        <Urls />
    </StyledDashboard>
  );
}

const StyledDashboard = styled.section`
    margin: 5rem auto auto auto;
    padding: auto var(--padding-big);
`;
