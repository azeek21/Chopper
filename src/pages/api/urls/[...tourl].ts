import mongoClient from "@/db/connect";
import UrlModel, { URL_DATA_INTERFACE } from "@/db/models/url-model";
import { HydratedDocument } from "mongoose";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongoClient();
    const doc = await UrlModel.findOne<HydratedDocument<URL_DATA_INTERFACE>>({from_url: req.query.tourl}).exec();
    if (doc) {
        res.status(200).json(doc);
    }
    res.status(200).json({data: req.query.tourl})
    // const urldata = UrlModel.findOne({from_url: })
}
