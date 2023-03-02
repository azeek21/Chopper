import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize, parse } from "cookie";
import mongoClient from "@/db/connect";
import CreateUser from "@/db/create-user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = req.cookies;

    console.log(cookies);
    
    if (!cookies['weak-uid']) {
        await mongoClient();
        const user = await CreateUser();
        await user.save();

        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        const uid = serialize("weak-uid", user.uid, {
            path: '/',
            expires: date,
        });
        const secret = serialize("weak-secret", user.secret!, {
            path: '/',
            expires: date,
        });

        res.setHeader("Set-Cookie", [uid, secret]);
    }
    return res.status(200).json({success: "ok"});
};
