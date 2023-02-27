import React from "react"
import styled from "styled-components"

export default function Button({clickHandler, children}: {clickHandler: (ev: any) => void, children: any}) {

    return (
        <StyledButton onClick={clickHandler}>
            {...children}
        </StyledButton>
    )
}


const StyledButton  = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({theme}) => theme.backgrounColor.secondary};
    color: ${({theme}) => theme.textColor.secondary};
    padding: var(--padding-small);
    border-radius: var(--padding-normal);
`