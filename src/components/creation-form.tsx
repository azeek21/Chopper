import styled from "styled-components"
import Input from "./input"
import Button from "./button"
import { ChangeEvent, useState } from "react"
import LoadingOverlay from "./loading-overlay";


export default function CreationForm() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setUrl(ev.target.value)
    }

    const submitForm = async () => {
        if (!url) {

        }
        setLoading(true);
        const res = await (await fetch('/api/urls/create', {method: "POST", body: JSON.stringify({to_url: url})})).json()
        console.log(res.data);
        setLoading(false)
    }

    return (
        <section style={{
            display: 'flex'
        }}>
            <LoadingOverlay loading={loading}>
            <StyledCreationForm onSubmit={(ev) => {
                ev.preventDefault();
                submitForm();
            }}>
                <Input id="urlinput" onChange={changeHandler} value={url} disabled={loading} placeholder=" " required type={"url"} pattern="\S+" title="URLs can't include whitespaces"/> 
                <label className="label" htmlFor="urlinput" >Paste / Type your url </label>
                <Button clickHandler={() => {}}>
                    CREATE
                </Button>
            </StyledCreationForm>
            </LoadingOverlay>
        </section>       
    )
}

const StyledCreationForm = styled.form`
    position: relative;
    display: flex;
    gap: var(--padding-big);
`

