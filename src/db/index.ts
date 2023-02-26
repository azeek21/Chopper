import { randomUUID } from "crypto";

const newID = () => {
    return randomUUID();
}

const createUrlData = (from_url: string, owner: string): Url_Data_Type => {
    return {
        id: newID(),
        from_url: from_url,
        to_url: "asdf",
        created_at: Date.now(),
        clicks: 0,
        owner: newID(),
    }
} 

const Url_Data = {
    name: "UrlSchema",
    properties: {
        id: "string",
        from_url: "string",
        to_url: "string",
        created_at: "int",
        owner: "string",
        clicks: "int",
        passowrd: "string?",
        limit: "int?",
        timeout: "int?",
    },
    primaryKey: "id",
};

export type Url_Data_Type = {
    id: string,
    from_url: string,
    to_url: string,
    created_at: number,
    owner: string,
    clicks: number,
    password?: string,
    limit?: string,
    timeout?: string,
}

export { createUrlData };
