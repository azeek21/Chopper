import { useRouter } from "next/router";
import Link from "next/link";
import styled, { ThemedStyledProps } from "styled-components";
import { THEME_TYPE } from "@/styles/theme/theme";
import { ReactComponentElement } from "react";

export default function NavbarLink({
  href,
  name,
  clickHandler,
  Icon,
}: {
  href: string;
  name: string;
  clickHandler?: () => void;
  Icon?: React.FC
}) {
  const router = useRouter();

  const my_path = router.asPath;

  return (
    <StyledNavbarLink active={href === my_path} title={`Got to ${name}`}>
      <Link
        href={href}
        onClick={(ev) => {
          if (clickHandler) {
            ev.preventDefault();
            clickHandler();
          }
        }}
      >
        {Icon ? <Icon /> : ""}
        <p>{name}</p>
      </Link>
    </StyledNavbarLink>
  );
}

const StyledNavbarLink = styled.li<{
  theme: THEME_TYPE;
  active: boolean;
}>`
  padding: 0;
  margin: 0;
  font-size: var(--fs-normal);
  & a {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--padding-small);
    padding: var(--padding-small) var(--padding-normal);
    border-radius: 5rem;
    color: ${(props) =>
      props.active ? props.theme.textColor.primary : "white"};
    box-shadow: ${(props) =>
      props.active ? props.theme.shadow.primary : "none"};
    text-decoration: none;
    font-weight: ${(props) => (props.active ? "500" : "normal")};
    background-color: ${(props) => (props.active ? "white" : "transparent")};
    &:hover {
      color: ${({ theme }) => theme.textColor.primary};
      background-color: ${({ theme }) => theme.backgroundColor.primary};
      box-shadow: ${({ theme }) => theme.shadow.primary};
    }
  }

  @media (max-width: 600px) {
    & {
      font-size: var(--fs-sm);
      p {
        display: none;
      }
    }
}
`;
