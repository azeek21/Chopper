import Link from "next/link";
import styled from "styled-components";
import { Language } from "@mui/icons-material";

export default function Logo() {
  return (
    <StyledLogo>
      <Link href="/">
        CH
        <Language />
        PPER
      </Link>
    </StyledLogo>
  );
}

const StyledLogo = styled.span`
  font-size: var(--fs-2xl);
  text-transform: uppercase;
  font-weight: bold;
  border-radius: var(--padding-small);
  border: 0.15rem dashed ${ ({theme}) => theme.textColor.pink};
  padding: var(--padding-small);
  & a {
    color: ${({ theme }) => theme.textColor.primary};
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
