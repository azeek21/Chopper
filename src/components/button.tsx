import React from "react"
import styled from "styled-components"

const Button  = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({theme}) => theme.backgroundColor.primary};
    color: ${({theme}) => theme.textColor.pink};
    padding: var(--padding-small);
    border-radius: var(--padding-normal);
`

export default Button;