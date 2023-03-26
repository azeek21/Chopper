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
  PersonAddAlt1,
  AccountCircle,
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
    const newCookies = await fetch("/api/new-user");
    signOut();
  };
  console.log("PROFILE SESSION>>>");
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
            <span className="profile__signin">
              <Login /> <p>Sign In</p>
            </span>{" "}
          </Link>
        </StyledProfileContainer>
      </LoadingOverlay>
    );
  }

  return (
    <LoadingOverlay>
      <StyledProfileContainer>
        <Link
          href="api/auth/signout"
          onClick={(ev) => {
            ev.preventDefault();
          }}
        >
          <div className="profile__image">
            <StyledProfilePicture src={session.user.image || ""} />
          </div>
          <div className="profile__actions__container">
            <span
              title="Sign out ->"
              onClick={() => {
                customSignOut();
              }}
            >
              <p>Sign out</p>
              <Logout />
            </span>

            <span
              title="Connect another account +"
              onClick={() => {
                signIn();
              }}
            >
              {" "}
              <p>Add account</p> <PersonAddAlt1 />{" "}
            </span>
          </div>
        </Link>
      </StyledProfileContainer>
    </LoadingOverlay>
  );
}

const withPicStyle = `& .profile__actions__container {} &:hover .profile__actions__container {}`;

const StyledProfileContainer = styled.div<{ withPic?: boolean }>`
  position: relative;
  border-radius: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textColor.primary};
  color: white;
  border: 0.1rem solid ${({ theme }) => theme.textColor.purple};

  .profile__image {
    font-size: 2rem;
    padding: 0;
    margin: 0;
    height: min-content;
    line-height: 0;
    border-radius: 50%;
    aspect-ratio: 1;
    background-color: white;
    background-image: url("/avatar_placeholder.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: bottom;
    overflow: hidden;
    & svg {
      font-size: inherit;
    }
  }

  & span {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--padding-small);
    padding: var(--padding-small);
  }
  & .profile__signin {
    padding: var(--padding-normal);
  }

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
  & .profile__actions__container {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-evenly;
    gap: var(--padding-small);
    padding: var(--padding-small);
    border-radius: var(--padding-normal);
    color: black;
    background-color: white;
    position: absolute;
    top: 0;
    opacity: 0;
    right: 0;
    z-index: -9;
    width: 0;
    height: 0;
    overflow: hidden;
    & span {
      width: 100%;
      border: 0.1rem solid ${({ theme }) => theme.textColor.primary};
      border-radius: var(--padding-small);
      padding: var(--padding-small);
      &:hover {
        box-shadow: ${({ theme }) => theme.shadow.primary};
      }
    }
  }
  &:hover {
    background-color: white;
    color: ${({ theme }) => theme.textColor.primary};
    & .profile__actions__container {
      top: 0;
      height: auto;
      width: max-content;
      opacity: 1;
      z-index: 9;
    }
  }
  ${({ withPic }) => {
    if (withPic) {
      return withPicStyle;
    }
    return "";
  }}

  @media (max-width: 400px) {
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
