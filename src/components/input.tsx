import { ChangeEvent } from "react"
import styled from "styled-components"

const Input = styled.input`
    padding: var(--padding-gigant) var(--padding-normal) var(--padding-normal) var(--padding-normal);
    padding-left: 2rem;
    padding-right: var(--padding-big);
    border-radius: 1rem 10rem 10rem 1rem;
    border: none;
    outline-width: 0.15rem;
    outline-style: solid;
    outline-color: transparent;
    width: 100%;
    box-shadow: ${({theme}) => theme.shadow.primary};
    &:hover {
        outline-color: ${ ({theme}) => theme.backgroundColor.purple};
    }

    &:focus {
        outline-color: ${ ({theme}) => theme.backgroundColor.purple};
    }
`


export default Input;