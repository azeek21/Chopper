import UrlModel from "./models/url-model";
import { URL_DATA_INTERFACE } from "./models/url-model";
import { HydratedDocument } from "mongoose";
import newUrlId from "@/utils/new-from-url";

type CreateUrlOptions = {
    password?: string,
    limit?: number,
    timeout?: number,
}

export default async function CreateUrl(onwer: string, to_url: string, options?: CreateUrlOptions): Promise<HydratedDocument<URL_DATA_INTERFACE>> {
    const last = await UrlModel.findOne<URL_DATA_INTERFACE>().sort({created_at: "desc"}).exec();
    const urlid = newUrlId(last?.urlid || "");
    const domain = process.env.DOMAIN;
    if (!domain) {
        throw new Error("DOMAIN NOT FOUND IN ENVIROMENT. PELASE CHECK IF DOMAIN PROPERY EXISTS IN .env.local FILE");
    }

    return new UrlModel<URL_DATA_INTERFACE>({
        url: domain + urlid,
        urlid: urlid,
        to_url: to_url,
        owner: onwer,
        created_at: Date.now(),
        clicks: 0,
        password: options?.password,
        limit: options?.limit,
        timeout: options?.timeout
    })
}
