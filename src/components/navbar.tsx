import styled from "styled-components";
import LoadingOverlay from "./loading-overlay";
import { signIn, signOut, useSession } from "next-auth/react";
import NavbarLink from "./navbar-link";
import { useEffect, useState } from "react";
import {
  Home,
  NotificationsActive,
  PostAdd,
  Login,
  Logout,
} from "@mui/icons-material";
import { DefaultUser, Session, User } from "next-auth";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <StyledNavbar>
        <NavbarLink Icon={Home} href="/" name="HOME" />
        <NavbarLink Icon={PostAdd} href="/dashboard" name="DASHBOARD" />
        <NavbarLink Icon={NotificationsActive} href="/news" name="NEWS" />

        {/* SINGIN */}
        {/* {sessionStatus === "loading" || sessionStatus === "unauthenticated" || loading ? (
          <LoadingOverlay loading={loading}>
            <NavbarLink
              href="/api/auth/signin"
              name="SIGN IN"

              clickHandler={() => {
                SetLoading(true);
                signIn()
              }
            }
            />
          </LoadingOverlay>
        ) : (
          ""
        )} */}

        {/* SIGNOUT */}
        {/* {sessionStatus === "authenticated" ? (
          <LoadingOverlay loading={loading}>
            <NavbarLink
              href="/api/auth/signout"
              name="SIGN OUT"
              Icon={() => {return session.user.image ? PfP(session.user.image) : null}}
              clickHandler={() => {
                SetLoading(true);
                signOut();
              }}
            />
          </LoadingOverlay>
        ) : (
          ""
        )} */}

        {/* PROFILE */}
        <Profile />
      </StyledNavbar>
    </nav>
  );
}

const StyledNavbar = styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--padding-gigant);
  @media (max-width: 600px) {
    & {
      gap: var(--padding-normal);
    }
  }
  @media (max-width: 350px) {
    gap: var(--padding-small);
  }
`;

function PfP(src: string) {
  return <StyledProfilePicture src={src} />;
}

function Profile() {
  const { data: session, status: status } = useSession();

  const customSignOut = async () => {
    const newCookies = await fetch('/api/new-user');
    signOut();
  }
  console.log("PROFILE SESSION>>>")
  console.log(session);

  if (!session) {
    return (
      <LoadingOverlay loading={status === "loading"}>
        <StyledProfileContainer>
          <Link
            href="/api/auth/singin"
            title="Sign in"
            onClick={(ev) => {
              ev.preventDefault();
              signIn();
            }}
          >
            {" "}
            <span>
              <Login /> <p>Sign In</p>
            </span>{" "}
          </Link>
        </StyledProfileContainer>
      </LoadingOverlay>
    );
  }

  return (
    <LoadingOverlay>
      <StyledProfileContainer
        withPic={
          session.user && session.user.image && session.user.image?.length > 0
            ? true
            : false
        }
      >
        <Link
          href="api/auth/signout"
          title="Sign out"
          onClick={(ev) => {
            ev.preventDefault();
            if (!session.user.image) {
              customSignOut();
            }
          }}
        >
          {session.user && session.user.image && (
            <StyledProfilePicture src={session.user.image} />
          )}
          <span
            onClick={() => {
              customSignOut();
            }}
          >
            <p>Sign out</p>
            <Logout />
          </span>
        </Link>
      </StyledProfileContainer>
    </LoadingOverlay>
  );
}

const withPicStyle = `& span {position: absolute; top:0; opacity: 0; right: 0; z-index: -9; width: max-content;} &:hover span {top: 130%; opacity: 1; z-index: 9; color: black; background-color: white; border-radius: var(--padding-small); padding: var(--padding-big)}`;

const StyledProfileContainer = styled.div<{ withPic?: boolean }>`
  position: relative;
  border-radius: var(--padding-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textColor.primary};
  color: white;
  & a {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--padding-small);
    color: inherit;
    text-decoration: none;
    & svg {
      font-size: inherit;
    }
  }
  & span {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    gap: var(--padding-small);
    padding: var(--padding-normal);
    border-radius: var(--padding-normal);
  }
  &:hover {
    background-color: white;
    color: ${({ theme }) => theme.textColor.primary};
  }
  ${({ withPic }) => {
    if (withPic) {
      return withPicStyle;
    }
    return "";
  }}

  @media (max-width: 550px) {
    & p {
      display: none;
    }
  }
`;

const StyledProfilePicture = styled.img`
  display: inline-block;
  height: var(--fs-4xl);
  object-fit: cover;
  border-radius: 50%;
  aspect-ratio: 1;
`;
