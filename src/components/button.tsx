import React from "react"
import styled from "styled-components"

const Button  = styled.button<{active?: boolean | unknown}>`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({theme}) => theme.backgroundColor.secondary};
    color: ${({theme}) => theme.textColor.primary};
    padding: var(--padding-small);
    border-radius: var(--padding-normal);
    border: 0.1rem solid ${ ({theme}) => theme.backgroundColor.secondary};
    background-image: ${ (props) => props.active ? "linear-gradient(90deg, #810094, #fb457f)" : "none"};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    color: ${ (props) => props.active ? "white" : props.theme.textColor.primary};
    font-weight: ${  (props) => props.active ? "500" : "400"};
    color: white;
    &:hover {
        box-shadow: ${ ({theme}) => theme.shadow.primary};
    };
    ${ ({ disabled}) => disabled ? "background-color: gray;" : ""}
`

export default Button;