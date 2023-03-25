import styled from "styled-components"
import Input from "./input"
import Button from "./button"
import { ChangeEvent, useContext, useEffect, useState } from "react"
import LoadingOverlay from "./loading-overlay";
import { Link, Key, Visibility, VisibilityOff, LinkOff, ManageHistory, Update } from "@mui/icons-material";
import { getCookie } from "@/utils/cookie";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import { useMutation, useQueryClient } from "react-query";

type FORM_TYPE = {
    to_url: string,
    limit: string,
    password: string,
    timeout: string,
}

const initialFormState = {
    to_url: "",
    limit: '',
    password: "",
    timeout: "",
}

export default function CreationForm() {
    const [form, setForm] = useState<FORM_TYPE>(initialFormState);
    const [passwordVisible, setPasswordVisible] = useState(false);
    console.log("SSR -------------");
    
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [hasCookies, setHasCookies] = useState(false);
    const queryClient = useQueryClient();
    const mutatator = useMutation(async () => {
        return (await fetch('/api/urls/create', {method: "POST", body: JSON.stringify(form)})).json();
    }, {
        onMutate: () => { setLoading(true) },
        onSuccess: () => { setForm(initialFormState); setLoading(false); },
        onSettled: () => { setExpanded(false); queryClient.invalidateQueries("lastAdded"); queryClient.invalidateQueries("urls");},
    })

    useEffect( () => {
        const x = () => {
            const res = getCookie();
            if (!res || res.noCookie) {
                return false;
            }
            return true;
        };
        setHasCookies(x)
    }, [])

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setForm(oldForm => {
            let copy = {...oldForm};
            switch (ev.target.name) {
                case "url":
                    copy.to_url = ev.target.value;
                    break;
            
                case "limit": 
                    copy.limit = ev.target.value;
                    break;
                
                case "password":
                    copy.password = ev.target.value;
                    break;

                case "timeout":
                    copy.timeout = ev.target.value;
                    break;
            }
            return copy;
        })
    }

    const submitForm = async () => {
        mutatator.mutate();
    }

    return (
        <div style={{
            display: 'flex'
        }}>
            <StyledCreationForm onSubmit={(ev) => {
                ev.preventDefault();
                submitForm();
            }}
            autoComplete="off"
            autoSave="off"
            >

            <FormItemWrapper>
            <UrlInput id="urlinput" onChange={changeHandler} value={form?.to_url} name="url" disabled={loading} placeholder=" " required type={"url"} pattern="\S+" title="Must be valid URL !" onInvalid={() => {}}  autoComplete="new-password"/>
            <span>
                <Link />
            </span>
                <label className="label" htmlFor="urlinput" title="Any valid url">https://example.com/ </label>
            <LoadingOverlay loading={loading}>
                <CreateButton active={true}>
                    CREATE
                </CreateButton>
            </LoadingOverlay>
            </FormItemWrapper>

            
            { (form.to_url.length > 0 || expanded) &&
            <div style={{display: "flex", width: "100%", gap: "var(--padding-normal)"}}> 
                <Button type="button" onClick={(ev) => {
                    setExpanded(expanded => !expanded);
                    const domElem = ev.target as HTMLElement;
                    domElem.scrollIntoView({behavior: "smooth", block: expanded ? "end" : "start", inline: "center"});
                }}>
                    {expanded ? <ExpandLess/> : <ExpandMore />}
                </Button>

                <FormItemWrapper>
               <Input type={"date"} id="timeout" name="timeout" value={form.timeout || ""} onChange={changeHandler} placeholder=" " title="Url will be disabled after this date."/>
               <label className="label" htmlFor="timeout"> Disable after this date </label>
               <span> <Update /> </span>
               </FormItemWrapper>


                </div>
            }

            { expanded &&
                <>
                {/* PASSWORD INPUT */}
                <FormItemWrapper>
                <Input
                    id="password"
                    value={form.password || ""}
                    name="password"
                    placeholder=" "
                    title="Any password, security is yours, who cares 🤷‍♂️"
                    required={false}
                    type={passwordVisible ? "text" : "password"}
                    style={{paddingRight: "2rem"}}
                    onChange={changeHandler}
                    autoComplete="new-password"
                />
                <span> <Key /> </span>
                <div onClick={() => {setPasswordVisible( visible => !visible)}}>
                    <Button type="button">
                    {passwordVisible ? <Visibility /> : <VisibilityOff />}
                    </Button>
                </div>
                <label className="label" htmlFor="password"> Password </label> 
                </FormItemWrapper>


                {/* LIMIT INPUT */}
               <FormItemWrapper>
               <Input type={"number"} id="limit" name="limit" min={1} value={form.limit || ""} onChange={changeHandler} placeholder=" " title="Url will be disabled after being used for N times."/>
               <label className="label" htmlFor="limit"> First N people can use this link </label>
               <span> <LinkOff /> </span>
               </FormItemWrapper>
               


                {/* TIMEOUT INPUT */}
               </>
            }

            </StyledCreationForm>

        </div>       
    )
}

const StyledCreationForm = styled.form`
width:100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    gap: var(--padding-big);
    border-radius: 0.5rem;
`

export const FormItemWrapper = styled.div`
width: 100%;
    position: relative;
    display: flex;
    min-width: max-content;
    min-height: max-content;
    & div {
        position: absolute;
        left: 100%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    & span {
        position: absolute;
        left: 0.08rem;
        top: var(--padding-gigant);
        transform: translateY(-35%);
        z-index: 9;
        font-size: var(--fs-xsm);
        color: ${ ({theme}) => theme.textColor.secondary}
    }

`

const CreateButton = styled(Button)`
    padding: var(--padding-big);
    font-size: var(--fs-normal);
    border-radius: 5rem;
    box-shadow: ${({theme}) => theme.shadow.primary};
    color: white;
    font-weight: bold;
    border: none;
    &:hover{
        text-shadow: 0.03rem 0.03rem 0.3rem whitesmoke;
        box-shadow: ${({theme}) => theme.shadow.primary};
    }

    @media (max-width: 550px) {
        font-size: inherit;
        padding: var(--padding-big) var(--padding-normal);
    }
`


const UrlInput = styled(Input)`
    padding-left: 2rem;
    padding-right: var(--padding-big);
    border-radius: 1rem 10rem 10rem 1rem;
    box-shadow: ${({theme}) => theme.shadow.primary};
    color: purple;
    font-weight: 500;
`