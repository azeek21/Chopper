import Button from "@/components/button"
import CreationForm from "@/components/creation-form"
import styled from "styled-components"
import { Link } from '@mui/icons-material';
import Title from "@/components/title";
import { useEffect, useState } from "react";
import typeWriter from "@/utils/typewriter";

export default function Index() {
    const [uid, setUid] = useState('')

    useEffect(() => {
          setTimeout(() => {
            typeWriter();
          }, 1000);

          if (!uid) {
            const createuser = async () => {
                const olduid = localStorage.getItem('uid');
                if (olduid) {
                    setUid(olduid);
                    return ;
                } else {
                    const resp = await (await (fetch('/api/new-user'))).json();
                    const newuid = resp.uid || "";
                    localStorage.setItem("uid", newuid);
                    setUid(newuid);
                }
            }
            createuser();
          }
    }, [])

    return (
        <StyledHome>
            <RoundButton>
                <Link />
            </RoundButton>
            <HomeTitle>
                A SIMPLE LINK BUT A POWERFUL TOOL FOR 
                <Nefor id="demo">
                    Everyone ?
                </Nefor>
            </HomeTitle>
            <HomeText>
                Our tool allows you seamlessly track your links with simple and easy-to-remember yet powerfull links and provide your customers a unique toilered experinece
            </HomeText>
        <CreationForm />
        </StyledHome>
    )
}

const HomeTitle = styled(Title)`
    font-size: var(--fs-4xl);
    line-height: normal;
    color: ${ ({theme}) => theme.textColor.primary};
    text-shadow: ${ ({theme}) => theme.shadow.pink};
`

const Nefor = styled.span`
    padding-left: 1rem;
    background-image: linear-gradient(90deg, #810094, #fb457f);
    background-clip: text;
    -webkit-background-clip:text;
    -webkit-text-fill-color: transparent;
`

const HomeText = styled.p`
    font-size: var(--fs-l);
    color: ${ ({theme}) => theme.textColor.secondary };   
    line-height: normal;    
    letter-spacing: 0.05rem;
`

const StyledHome = styled.section`
    margin: 8rem auto auto 2rem;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    max-width: 50%;
    gap: 1rem;
`

const RoundButton = styled(Button)`
    transform: rotateZ(-45deg);
    border-radius: 50%;
    aspect-ratio: 1;
    box-shadow: ${ ({theme}) => theme.shadow.primary};
`