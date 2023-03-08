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
    margin: auto auto auto auto;
    padding-top: 5rem;
`;
