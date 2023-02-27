import CreateUrl from "@/db/create-url";
import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;

    switch (method) {
        case "GET":
            const url = await CreateUrl(randomUUID(), "http://localhost:3000/");
            await url.save();
            res.status(201).json({status: "Sucess", data: url.toJSON()})
            break;
        case "POST": 
            res.status(400).json({error: "Bad request!"})
            break;
        default:
            res.status(400).json({error: "bad request!"})
            break;
    }
}