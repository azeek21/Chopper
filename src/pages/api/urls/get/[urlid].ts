import mongoClient from "@/db/connect";
import getUrl from "@/db/get-url";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const urlid = req.query.urlid;
    if (!urlid || typeof(urlid) === "object" && urlid.length > 1) {
        res.status(404).json({ error: "Bad request" })
        return ;
    }

    await mongoClient();

    const url = await getUrl(req, urlid as string);

    if (!url) {
        res.status(404).json({ error: "Url not found! Non-existing urlid or not authenticated."});
        return ;
    }

    setTimeout(() => {
        res.status(200).json(url);
    }, 4000);
    return ;
};
