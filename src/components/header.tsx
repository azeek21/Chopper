import styled from "styled-components"
import Logo from "./logo"
import Navbar from "./navbar"

export default function Header() {
    
    return (
        <StyledHeader>
            <Logo />
            <Navbar />
        </StyledHeader>
    )
}

const StyledHeader = styled.header`
    /* background-color: ${({theme}) => theme.backgroundColor.primary}; */
    color: ${({theme}) => theme.textColor.primary};
    padding: var(--padding-big);
    box-shadow: ${({ theme }) => theme.shadow.primary};
    display: flex;
    align-items: center;
    justify-content: space-between;
`
