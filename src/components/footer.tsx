import styled from "styled-components";
import {
  Favorite,
  GitHub,
  Email,
  EmailOutlined,
  EmailRounded,
  Telegram,
  StarOutline,
  WhatsApp,
} from "@mui/icons-material";
import Button from "./button";

export default function Footer() {
  return (
    <StyledFooter>
      <ul>
        <li>
          <h3>
            Brought to you with <Favorite /> by Azeek
          </h3>
        </li>
        <li>
          <a
            href="https://github.com/azeek21/url_shortener_practice"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button style={{ padding: "3px 5px", border: "0.1rem solid gray" }}>
              {" "}
              <StarOutline fontSize="small" /> Star
            </Button>{" "}
            on GitHub <GitHub />
          </a>
        </li>
        <li>
          <p>Contacts</p>
        </li>
        <li>
          <ContentWrapper>
            <a target="_blank" href="mailto:akraliev0516@gmail.com" rel="noreferrer">
              <EmailRounded /> askaraliev0516@gmail.com
            </a>
          </ContentWrapper>
          <ContentWrapper>
            <a target="_blank" href="https://t.me/foffnow" rel="noreferrer">
              <Telegram /> @foffnow
            </a>
          </ContentWrapper>
          <ContentWrapper>
            <a
              href="https://wa.me/79032120900/?text=Hey,%20I%20love%20your%20URL%20shortener%20project.%0A"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsApp />
              Send Message
            </a>
          </ContentWrapper>
          <ContentWrapper>
            <a
              href="https://github.com/azeek21"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub /> azeek21
            </a>
          </ContentWrapper>
        </li>
      </ul>
    </StyledFooter>
  );
}

const StyledFooter = styled.footer`
  font-size: 90%;
  color: ${({ theme }) => theme.textColor.pink};
  background-color: ${({ theme }) => theme.backgroundColor.purple};
  text-align: center;
  padding: 0 var(--padding-normal) var(--padding-normal) var(--padding-normal);
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
  &::before {
    content: "";
    position: absolute;
    top: -5rem;
    left: 0;
    height: 5rem;
    width: 100%;
    background-image: url("/waves.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    z-index: -9;
  }
  & ul {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--padding-normal);
  }

  & a {
    color: inherit;
    text-decoration: none;
    display: flex;
    gap: var(--padding-small);
    align-items: center;
    &:hover {
      color: white;
    }
  }
  & li {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--padding-gigant);
    flex-wrap: wrap;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--padding-normal);
`;
