import mongoClient from "@/db/connect";
import CreateUrl from "@/db/create-url";
import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;

    const session = await getSession({req});

    // if (method == "POST") {
    //     await mongoClient();
    //     const url = await CreateUrl(randomUUID(), "http://localhost:3000/");
    //     await url.save();
    //     res.status(201).json({status: "Sucess", data: url.toJSON()})
    // }
    if (method === "POST") {
        res.redirect(JSON.parse(req.body).to_url);
        // res.status(201).json({error: "bad request!", data: JSON.parse(req.body)})
        res.status(200).json({body: "success"})
        return;
    }
    res.status(400).json({err: "BAD"})
}
