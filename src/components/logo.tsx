import Link from "next/link";
import styled from "styled-components";

export default function Logo() {
  return (
    <StyledLogo>
      <Link href="/">
        CHOP
        <img src={"/axe.png"} alt="Two Saw Crossed Logo" />
        PER
      </Link>
    </StyledLogo>
  );
}

const StyledLogo = styled.span`
  background-color: rgba(255, 255, 255, 0.5);
  font-size: var(--fs-2xl);
  --img-width: var(--fs-2xl);
  text-transform: uppercase;
  font-weight: bold;
  border-radius: var(--padding-small);
  /* border: 0.15rem dashed ${({ theme }) => theme.textColor.pink}; */
  padding: var(--padding-small);
  box-shadow: ${({ theme }) => theme.shadow.secondary};
  & img {
    width: calc(var(--img-width) + 1rem);
    object-fit: contain;
  }
  & a {
    color: ${({ theme }) => theme.textColor.primary};
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @media (max-width: 550px) {
    & {
      font-size: var(--fs-xl);
      --img-width: var(--fs-xl);
    }
  }
`;
