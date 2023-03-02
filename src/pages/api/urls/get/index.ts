import mongoClient from "@/db/connect";
import getUrls from "@/db/get-urls";
import UrlModel, { URL_DATA_INTERFACE } from "@/db/models/url-model";
import UserModel, { USER_INTERFACE } from "@/db/models/user-model";
import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongoClient();
    const urls = await getUrls(req);
    res.status(200).json({urls: urls});
    return ;
}
