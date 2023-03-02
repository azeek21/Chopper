import { HydratedDocument } from "mongoose";
import { NextApiRequest } from "next";
import getUser from "./get-user";
import UrlModel, { URL_DATA_INTERFACE } from "./models/url-model";
import { USER_INTERFACE } from "./models/user-model";

export default async function getUrls(req: NextApiRequest) {
    const user = await getUser(req);
    let urls: Array<HydratedDocument<URL_DATA_INTERFACE>> = [];

    if (!user) {
        return urls;
    };

    const owner = user.uid;
    let tmpUrl;

    for ( let i = 0; i < user.urls.length; i++ ) {
        tmpUrl = await UrlModel.findOne<HydratedDocument<URL_DATA_INTERFACE>>({from_url: user.urls[i], owner: user.uid}).exec();
        if (tmpUrl) {
            urls.push(tmpUrl);
        }
    }

    return urls;
}