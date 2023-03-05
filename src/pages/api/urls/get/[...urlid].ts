import mongoClient from "@/db/connect";
import getUrl from "@/db/get-url";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const urlid = req.query.urlid;
    console.log(urlid);
    if (!urlid || typeof(urlid) === "object" && urlid.length > 1) {
        res.status(404).json({message: "Bad request"})
        return ;
    }

    await mongoClient();

    const url = await getUrl(req, urlid[0]);

    console.log(url);
    if (!url) {
        res.status(404).json({message: "Not Found, Bad cookies or such url does'nt exist"});
        return ;
    }
    res.status(200).json({url: url});
};
