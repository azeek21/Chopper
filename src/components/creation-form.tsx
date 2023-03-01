import styled from "styled-components"
import Input from "./input"
import Button from "./button"
import { ChangeEvent, useState } from "react"
import LoadingOverlay from "./loading-overlay";
import PasswordField from "./inputs/password";
import { Link } from "@mui/icons-material";

type FORM_TYPE = {
    to_url: string,
    limit: string,
    password: string,
    timeout: number | null,
}

export default function CreationForm() {
    const [form, setForm] = useState<FORM_TYPE>({
        to_url: "",
        limit: '',
        password: "",
        timeout: null,
    });

    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);

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
                    copy.timeout = parseInt(ev.target.value);
                    break;
            }
            return copy;
        })
    }

    const submitForm = async () => {
        if (!form) {

        }
        setLoading(true);
        const res = await (await fetch('/api/urls/create', {method: "POST", body: JSON.stringify(form)})).json()
        console.log(res.data);
        setLoading(false)
    }

    return (
        <div style={{
            display: 'flex',
            width: "50%",
            marginTop: "2rem",
            marginBottom: "2rem"
        }}>
            <StyledCreationForm onSubmit={(ev) => {
                ev.preventDefault();
                submitForm();
            }}
            autoComplete="off"
            autoSave="off"
            >
            <FormItemWrapper>
            <UrlInput id="urlinput" onChange={changeHandler} value={form?.to_url} name="url" disabled={loading} placeholder=" " required type={"url"} pattern="\S+" title="URLs can't include whitespaces" onInvalid={() => {}}  autoComplete="new-password"/>
            <RotatedLink>
                <Link />
            </RotatedLink>
                <label className="label" htmlFor="urlinput" >Url: https://example.com/your-site </label>
            <LoadingOverlay style={{position: "absolute", top: '50%', right: '0', transform: "translate(50%, -50%)"}} loading={loading}>
                <CreateButton>
                    CREATE
                </CreateButton>
            </LoadingOverlay>
            </FormItemWrapper>
            {/* <Button onClick={(ev) => {
                setExpanded(old => !old)}}
                type={"button"}
                style={{alignSelf: "center"}}
                >
                Open
            </Button> */}
            {/* { expanded &&
                <>
               <PasswordField value={form.password} clickHandler={changeHandler} />
               <FormItemWrapper>
               <Input id="limit" name="limit" value={form.limit || ""} onChange={changeHandler} placeholder=" " title="Limit must be numeric" pattern="^[0-9]*$"/>
               <label className="label" htmlFor="limit"> First N people can use this link </label>
               </FormItemWrapper>
               </>
            } */}
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
    /* border: 0.1rem solid gray; */
`

const FormItemWrapper = styled.div`
width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: max-content;
    min-height: max-content;
`

const CreateButton = styled(Button)`
    background-image: linear-gradient(45deg, ${ ({theme}) => theme.backgroundColor.purple}, ${ ({theme}) => theme.backgroundColor.pink});
    padding: var(--padding-normal);
    border-radius: 5rem;
    box-shadow: ${({theme}) => theme.shadow.primary};
    color: white;
    font-weight: bold;
`
const RotatedLink = styled.span`
    position: absolute;
    left: 0.08rem;
    top: var(--padding-gigant);
    transform: translateY(-35%);
    z-index: 9;
    font-size: var(--fs-xsm);
    color: ${ ({theme}) => theme.textColor.secondary}
`

const UrlInput = styled(Input)`
    padding-left: 2rem;
    padding-right: var(--padding-big);
    border-radius: 1rem 10rem 10rem 1rem;
    box-shadow: ${({theme}) => theme.shadow.primary};
    color: purple;
    font-weight: 500;
`