import { ChangeEvent } from "react"
import styled from "styled-components"

const Input = styled.input`
    padding: var(--padding-gigant) var(--padding-normal) var(--padding-normal) var(--padding-normal);
    border: 1px solid ${({theme}) => theme.backgrounColor.secondary};
    border-radius: var(--padding-normal);
`


export default Input;