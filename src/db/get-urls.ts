import { HydratedDocument } from "mongoose";
import { NextApiRequest } from "next";
import getUser from "./get-user";
import UrlModel, { URL_DATA_INTERFACE } from "./models/url-model";
import { USER_INTERFACE } from "./models/user-model";

export default async function getUrls(req: NextApiRequest, user? : USER_INTERFACE | null) {
    if (!user) {
        user = await getUser(req);
    };


    if (!user) {
        return null;
    };

    let urls: Array<URL_DATA_INTERFACE> = [];
    const owner = user.uid;
    let tmpUrl;

    for (let i = 0; i < user.urls.length; i++) {
        tmpUrl = await UrlModel.findOne<HydratedDocument<URL_DATA_INTERFACE>>({ owner: user.uid, urlid: user.urls[(user.urls.length - 1) - i] }).exec();
        if (tmpUrl) {
            urls.push(JSON.parse(JSON.stringify(tmpUrl)));
        }
    };

    return urls;
};
