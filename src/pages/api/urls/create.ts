import mongoClient from "@/db/connect";
import CreateUrl from "@/db/create-url";
import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;


    if (method == "POST") {
        const data = JSON.parse(req.body);
        if (!data.to_url) {
            return res.status(400).json({error: "Missing to_url!"})
        };
        await mongoClient();
        const url = await CreateUrl(randomUUID(), data. to_url);
        await url.save();
        return res.status(201).json({status: "Sucess", data: url.toJSON()})
    }

    res.status(400).json({err: "BAD"})
}
