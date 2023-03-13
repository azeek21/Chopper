import styled from "styled-components";
import {
  Favorite,
  GitHub,
  Email,
  EmailOutlined,
  EmailRounded,
  Telegram,
} from "@mui/icons-material";

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
          <p>Star on GitHub</p> <GitHub />
        </li>
        <li>
          <p>Contacts:</p>
        </li>
        <li>
          <ContentWrapper>
            <EmailRounded />{" "}
            <a target="_blank" href="mailto:akraliev0516@gmail.com">
              {" "}
              askaraliev0516@gmail.com
            </a>
          </ContentWrapper>
          <ContentWrapper>
            <Telegram />{" "}
            <a target="_blank" href="https://t.me/foffnow">
              @foffnow
            </a>
          </ContentWrapper>
          <ContentWrapper>
            <GitHub />{" "}
            <a
              href="https://github.com/azeek21"
              target="_blank"
              rel="noopener noreferrer"
            >
              azeek21
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
  }
  & li {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--padding-normal);
    flex-wrap: wrap;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--padding-normal);
`;
