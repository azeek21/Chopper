import { HydratedDocument } from "mongoose";
import { NextApiRequest } from "next";
import getUser from "./get-user";
import UrlModel, { URL_DATA_INTERFACE } from "./models/url-model";

export default async function getUrl(req: NextApiRequest, urlid: string) {
    const user = await getUser(req);
    if (!user || !urlid) {
        return null;
    }
    const url = await UrlModel.findOne<HydratedDocument<URL_DATA_INTERFACE>>({urlid: urlid, owner: user.uid}).exec();
    return url;  
}
