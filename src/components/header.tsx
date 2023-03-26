import styled from "styled-components";
import Logo from "./logo";
import Navbar from "./navbar";

export default function Header() {
  return (
    <StyledHeader>
      <Logo />
      <Navbar />
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  right: 0;
  /* background-color: ${({ theme }) => theme.backgroundColor.primary}; */
  color: ${({ theme }) => theme.textColor.primary};
  padding: var(--padding-normal);
  box-shadow: ${({ theme }) => theme.shadow.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(4px);
`;
