import { URL_DATA_INTERFACE } from "@/db/models/url-model";
import {
  Key,
  Visibility,
  VisibilityOff,
  LinkOff,
  ManageHistory,
  ContentCopy,
  ModeEdit,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Undo,
  Timelapse,
} from "@mui/icons-material";
import { ChangeEvent, useEffect, useState } from "react";
import { FormItemWrapper } from "./creation-form";
import Input from "./input";
import Button from "./button";
import styled from "styled-components";
import { useMutation, useQuery, useQueryClient } from "react-query";
import LoadingOverlay from "./loading-overlay";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat);

const initialDeleteContext = {
  deleting: false,
  time_left: 5,
  discard: () => {},
};

const DeleteContainer = styled.div<{active: boolean}>`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  color: ${ ({ active }) => active ? "red" : "inherit"};
  font-size: 100%;
  svg {
    font-size: 90%;
  }
`;


export default function UrlItem({ url }: { url: any }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({...url, timeout: url.timeout ? dayjs.unix(url.timeout).format("YYYY-MM-DD") : ""});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleteContext, setDeleteContext] = useState(initialDeleteContext);

  const queryClient = useQueryClient();

  // fetching
  const { data, isLoading, error } = useQuery(
    "url" + url.urlid,
    async () => {
      const newUrl = await (await fetch("/api/urls/get/" + url.urlid)).json();
      if (newUrl.error) {
        return null;
      }
      console.log(newUrl.timeout);
      newUrl.timeout = newUrl.timeout ? dayjs.unix(newUrl.timeout).format("YYYY-MM-DD") : "";
      console.log(newUrl.timeout);
      
      return newUrl;
    },
    {
      initialData: url,
      onSuccess: (data) => {
        setForm(data);
      },
      enabled: !editing && !deleteContext.deleting,
    }
  );

  // updating
  const update = useMutation(
    async (data: any) => {
      await fetch("/api/urls/update/" + url.urlid, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    {
      onMutate: () => {
        setLoading(true);
      },
      onSuccess: () => {
        queryClient.invalidateQueries("url" + url.urlid);
      },
      onSettled: () => {
        setLoading(false);
        setEditing(false);
      },
    }
  );

  // deleting
  const remove = useMutation(
    async () => {
      return await fetch("/api/urls/delete/" + url.urlid, {
        method: "DELETE",
      });
    },
    {
      onMutate: () => {
        setLoading(true);
      },
      onSuccess: () => {},
      onSettled: () => {
        setLoading(false);
        setEditing(false);
        queryClient.invalidateQueries("urls" + url.urlid);
        queryClient.invalidateQueries("url" + url.urlid);
      },
    }
  );

  const deleteHandler = () => {
    let i = deleteContext.time_left;

    const deleteTimeout = setInterval(() => {
      console.log("IN INTERVAL>>> ", i);

      if (i == 0) {
        remove.mutate();
        clearInterval(deleteTimeout);
        setDeleteContext(initialDeleteContext);
      } else if (i > 0) {
        setDeleteContext((old) => ({ ...old, time_left: old.time_left - 1 }));
        i--;
      }
    }, 1000);
    setDeleteContext((old) => ({
      ...old,
      deleting: true,
      discard: () => {
        clearInterval(deleteTimeout);
        setDeleteContext(initialDeleteContext);
      },
    }));
  };

  const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
    setForm((oldForm: any) => {
      let copy = { ...oldForm };
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
    });
  };

  const Copy = () => {
    navigator.clipboard.writeText(url.url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 10000);
  };

  if (!data || error) {
    return <></>;
  }

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        if (editing) {
          update.mutate(form);
        } else setEditing(true);
      }}
    >
      <LoadingOverlay loading={loading || isLoading}>
        <StyledUrlItem>
          <CopyField
            title={`Copy ${url.url} to Clipboard`}
            onClick={() => {
              Copy();
            }}
          >
            <CopyButton
              active={true}
              onClick={() => {
                Copy();
              }}
              title={`Copy ${url.url} to Clipboard`}
              style={{ color: copied ? "#0dff00" : "white" }}
            >
              <ContentCopy color="inherit" />
            </CopyButton>
            <h3>{url.url}</h3>
          </CopyField>
          {/* PASSWORD INPUT */}

          <UrlItemWrapper>
            <Input
              disabled={!editing}
              id={url.urlid + "password"}
              value={form.password || ""}
              name="password"
              placeholder=" "
              title="Any password, security is yours, who cares 🤷‍♂️"
              required={false}
              type={passwordVisible ? "text" : "password"}
              style={{ paddingRight: "2rem" }}
              onChange={changeHandler}
              autoComplete="new-password"
            />
            <span>
              {" "}
              <Key />{" "}
            </span>
            <div
              onClick={() => {
                setPasswordVisible((visible) => !visible);
              }}
            >
              <Button type="button">
                {passwordVisible ? <Visibility /> : <VisibilityOff />}
              </Button>
            </div>
            <label className="label" htmlFor={url.urlid + "password"}>
              {" "}
              Password{" "}
            </label>
          </UrlItemWrapper>

          {/* LIMIT INPUT */}
          <UrlItemWrapper>
            <Input
              disabled={!editing}
              type={"number"}
              id={url.urlid + "limit"}
              name="limit"
              value={form.limit || ""}
              onChange={changeHandler}
              placeholder=" "
              title="Url will be disabled after being used for N times."
              min={1}
            />
            <div></div>
            <label className="label" htmlFor={url.urlid + "limit"}>
              {" "}
              Limit (number){" "}
            </label>
            <span>
              {" "}
              <LinkOff />{" "}
            </span>
          </UrlItemWrapper>

          {/* TIMEOUT INPUT */}
          <UrlItemWrapper>
            <Input
              disabled={!editing}
              type={"date"}
              id={url.urlid + "timeout"}
              name="timeout"
              value={form.timeout || ""}
              onChange={changeHandler}
              placeholder=" "
              title="Url will be disabled after this date."
            />
            <div></div>
            <label className="label" htmlFor={url.urlid + "timeout"}>
              {" "}
              Expiration Date{" "}
            </label>
            <span>
              {" "}
              <ManageHistory />{" "}
            </span>
          </UrlItemWrapper>

          {/* CONTROLS HERE */}
          <Controls>
            {/* EDITc BUTTON */}

            {!deleteContext.deleting && (
              <Button type="submit">
                {editing ? (
                  <SaveIcon titleAccess="Save" />
                ) : (
                  <ModeEdit titleAccess="Edit" />
                )}
              </Button>
            )}

            <Button
              type="button"
              title={deleteContext.deleting ? "CANCEL" : "DELETE"}
              onClick={() => {
                if (deleteContext.deleting) {
                  deleteContext.discard();
                } else {
                  deleteHandler();
                }
              }}
            >
              {deleteContext.deleting ? <Undo /> : <DeleteIcon />}
              {deleteContext.deleting && (
                <DeleteContainer active={deleteContext.time_left < 3}>
                  <p>{deleteContext.time_left}</p>
                  <Timelapse />
                </DeleteContainer>
              )}
            </Button>
          </Controls>
        </StyledUrlItem>
      </LoadingOverlay>
    </form>
  );
}


const StyledUrlItem = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1.3fr 1fr 0.6fr 0.7fr 0.3fr;
  grid-gap: var(--padding-gigant);
  align-content: center;
  justify-content: center;
  align-items: center;
  justify-items: center;
  padding: var(--padding-normal);
  color: ${({ theme }) => theme.textColor.purple};
  box-shadow: ${({ theme }) => theme.shadow.primary};
  border-radius: var(--padding-normal);
`;

const CopyButton = styled(Button)`
  height: 80%;
`;

const UrlItemWrapper = styled(FormItemWrapper)`
  width: 100%;
  min-width: auto;
  div {
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translate(-110%, -50%);
  }
  input {
    border-radius: var(--padding-normal);
    &:not(:placeholder-shown) ~ div {
      transform: translate(-110%, -50%);
    }
  }
  height: 100%;
`;

const CopyField = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--padding-normal);
  height: 100%;
  width: 100%;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: var(--padding-normal);
`;
