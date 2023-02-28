import UrlModel from "./models/url-model";
import { URL_DATA_INTERFACE } from "./models/url-model";
import { HydratedDocument } from "mongoose";
import { randomUUID } from "crypto";
import mongoClient from "./connect";
import newFromUrl from "@/utils/new-from-url";

type CreateUrlOptions = {
    password?: string,
    limit?: number,
    timeout?: number,
}

export default async function CreateUrl(onwer: string, to_url: string, options?: CreateUrlOptions): Promise<HydratedDocument<URL_DATA_INTERFACE>> {
    const last = await UrlModel.findOne<URL_DATA_INTERFACE>().sort({created_at: "desc"}).exec();
    const from_url = newFromUrl(last?.from_url || "");

    return new UrlModel<URL_DATA_INTERFACE>({
        from_url: from_url,
        to_url: to_url,
        owner: onwer,
        created_at: Date.now(),
        clicks: 0,
        password: options?.password,
        limit: options?.limit,
        timeout: options?.timeout
    })
}
