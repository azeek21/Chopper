import { useRouter } from "next/router";
import Link from "next/link";
import styled, { ThemedStyledProps } from "styled-components";
import { THEME_TYPE } from "@/styles/theme/theme";

export default function NavbarLink({
  href,
  name,
  clickHandler,
}: {
  href: string;
  name: string;
  clickHandler?: () => void;
}) {
  const router = useRouter();

  const my_path = router.asPath;

  return (
    <StyledNavbarLink active={href === my_path}>
      <Link
        href={href}
        onClick={(ev) => {
          if (clickHandler) {
            ev.preventDefault();
            clickHandler();
          }
        }}
      >
        {" "}
        {name}{" "}
      </Link>
    </StyledNavbarLink>
  );
}

const StyledNavbarLink = styled.li<{
  theme: THEME_TYPE;
  active: boolean;
}>`
  & a {
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
`;
