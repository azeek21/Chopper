import Link from "next/link"
import styled from "styled-components"

export default function Logo() {

    return (
        <StyledLogo>
            <Link href="/">NEXTAUTH</Link>
        </StyledLogo>
    )
}

const StyledLogo = styled.span`
    font-size: var(--fs-2xl);
    text-transform: uppercase;
    font-weight: bold;
    & a{
        color: ${({theme}) => theme.textColor.primary};
        text-decoration: none;
    }
`