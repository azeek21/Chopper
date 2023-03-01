import { ChangeEvent } from "react"
import styled from "styled-components"

const Input = styled.input`
    padding: var(--padding-gigant) var(--padding-normal) var(--padding-normal) var(--padding-normal);
    /* border: 1px solid ${({theme}) => theme.backgroundColor.secondary}; */
    /* border-radius: var(--padding-normal); */
    border: none;
    outline-width: 0.15rem;
    outline-style: solid;
    outline-color: transparent;
    width: 100%;
    &:hover {
        outline-color: ${ ({theme}) => theme.backgroundColor.purple};
    }

    &:focus {
        outline-color: ${ ({theme}) => theme.backgroundColor.purple};
    }
    &:not(:placeholder-shown) ~ div {
        transform: translate(110%, -50%) !important
    }

    &:focus ~ span {
    transform: translateY(0) rotateZ(-45deg); 
    }

    &:not(:placeholder-shown) ~ span {
        transform: translateY(0) rotateZ(-45deg);
    }
`


export default Input;