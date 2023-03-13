import styled from "styled-components";
import LoadingOverlay from "./loading-overlay";
// singin and signout with buttons
// from nextauth 4.*, singIn and signOut methods are in 'next-auth/react` not in 'next-auth/client`
// import { getSession, signIn, signOut, useSession } from "next-auth/react";
import NavbarLink from "./navbar-link";
import { useEffect, useState } from "react";
import { Home, NotificationsActive, PostAdd } from "@mui/icons-material";

export default function Navbar() {
//   const { data: session, status: sessionStatus } = useSession();
  const [loading, SetLoading] = useState(false);

  return (
    <nav>
      <StyledNavbar>
        <NavbarLink Icon={Home} href="/" name="HOME" />
        <NavbarLink Icon={PostAdd}  href="/dashboard" name="DASHBOARD" />
        <NavbarLink Icon={NotificationsActive}  href="/news" name="NEWS" />

        {/* SINGIN */}
        {/* {SESstatus === "loading" || SESstatus === "unauthenticated" || loading ? (
          <LoadingOverlay loading={loading}>
            <NavbarLink
              href="/api/auth/signin"
              name="SIGN IN"
              clickHandler={() => {
                SetLoading(true);
                signIn('github')
              }
            }
            />
          </LoadingOverlay>
        ) : (
          ""
        )} */}

        {/* SIGNOUT */}
        {/* {SESstatus === "authenticated" ? (
          <LoadingOverlay loading={loading}>
            <NavbarLink
              href="/api/auth/signout"
              name="SIGN OUT"
              clickHandler={() => {
                SetLoading(true);
                signOut();
              }}
            />
          </LoadingOverlay>
        ) : (
          ""
        )} */}
      </StyledNavbar>
    </nav>
  );
}

const StyledNavbar = styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--padding-gigant);
  @media (max-width: 550px) {
    & {
      gap: var(--padding-normal)
    }
}
`;
