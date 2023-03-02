import { createGlobalStyle } from "styled-components";
import { THEME_TYPE } from "./theme/theme";

export const GlobalStyle = createGlobalStyle<{ theme: THEME_TYPE }>`
html {
    scroll-behavior: smooth;
}

::selection {
  background-color: ${({theme}) => theme.textColor.purple};
  /* background-color: ${({theme}) => theme.backgroundColor.pink}; */
  color: white;
}

:root{
  /* paddings */
  --padding-gigant: 1.5rem;
  --padding-big: 1rem;
  --padding-normal: 0.5rem;
  --padding-small: 0.3rem;
  --padding-none: 0;

  /* fonts sizes */
  --fs-xsm: 0.75rem;
  --fs-sm: 0.875rem;
  --fs-normal: 1rem;
  --fs-l: 1.125rem;
  --fs-xl: 1.25rem;
  --fs-2xl: 1.5rem;
  --fs-3xl: 1.875rem;
  --fs-4xl: 2.25rem;
  --fs-5xl: 3rem;
  --fs-6xl: 3.75rem;
  --fs-7xl: 4.5rem;
}


*,
*::before,
*::after {
  box-sizing: border-box;
  scroll-behavior: smooth;
  transition: 200ms ease-in-out;
}

html {
  font-size: 100%;
}

body {
  position: relative;
  margin: 0;
  padding: 0px;
  overflow-x: hidden;
  min-height: 100vh;
  text-rendering: optimizeSpeed;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 1rem;
  color: ${({ theme }) => theme.textColor.primary};
  background-color: ${({ theme }) => theme.backgroundColor.primary};
  line-height: 1;
  transition: 0.3s linear;
  // expreimental
  background-image:  url("/top-right.svg");
  background-repeat: no-repeat;
  background-position: top right;
  background-size: 50%;
}

h1,
h2,
h3,
h4,
h5,
h6,
p,
ul,
figure,
blockquote,
dl,
dd {
  padding: 0;
  margin: 0;
}
button {
  border: none;
  background-color: transparent;
  font-family: inherit;
  padding: 0;
  cursor: pointer;
}
/* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
ul[role="list"],
ol[role="list"] {
  list-style: none;
}
li {
  list-style-type: none;
}
/* Set core root defaults */
html:focus-within {
  scroll-behavior: smooth;
}
/* A elements that don't have a class get default styles */
a:not([class]) {
  text-decoration-skip-ink: auto;
}

/* Make images easier to work with */
img,
picture {
  max-width: 100%;
  display: block;
}

/* Inherit fonts for inputs and buttons */
input,
button,
textarea,
select {
  font: inherit;
}
/* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
@media (prefers-reduced-motion: reduce) {
  html:focus-within {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

// Loader styles
.loader {
  position: relative;
  padding: var(--padding-small);
  min-width: min-content;
}

.loader::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  animation: loading ease-in-out 2s infinite;
  background-image: linear-gradient(90deg, rgba(255,255,255,0.0), rgba(128, 0, 128, 0.7), rgba(255,255,255,0.0));
  backdrop-filter: blur(0.1rem);
  box-shadow:  ${({theme}) => theme.shadow.primary};
  background-size: 50%;
  background-repeat: no-repeat;
  border-radius: 0.5rem;
}

@keyframes loading{
  0% {
    background-position: -100%;
  }
  100% {
    background-position: 250%;
  }
}

.label {
  position: absolute;
  top: 50%;
  left: var(--padding-gigant);
  transform: translateY(-50%);
  line-height: 1rem;
  font-size: var(--fs-normal);
  cursor: text;
  color: ${({theme})=> theme.textColor.secondary};
  transition: 200ms ease-in-out;
}

input:focus ~ .label{
  transform: none;
  top: var(--padding-small);
  left: var(--padding-small);
  font-size: var(--fs-sm);
  color: ${({theme})=> theme.textColor.primary};
}

input:not(:placeholder-shown) ~ .label{
  transform: none;
  top: var(--padding-small);
  left: var(--padding-small);
  font-size: var(--fs-sm);
  color: ${({theme})=> theme.textColor.primary};
};


`