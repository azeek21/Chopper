import { HydratedDocument } from "mongoose";
import { NextApiRequest } from "next";
import getUser from "./get-user";
import UrlModel, { URL_DATA_INTERFACE } from "./models/url-model";

export default async function getUrl(req: NextApiRequest, from_url: string) {
    const user = await getUser(req);
    if (!user || !from_url) {
        return null;
    }
    const url = await UrlModel.findOne<HydratedDocument<URL_DATA_INTERFACE>>({from_url: from_url, owner: user.uid}).exec();
    return url;  
}
