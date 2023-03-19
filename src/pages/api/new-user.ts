import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize, parse } from "cookie";
import mongoClient from "@/db/connect";
import CreateUser from "@/db/create-user";
import generateUserCookies from "@/utils/generate-user-cookies";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = req.cookies;

    if (!cookies['weak-uid']) {
        await mongoClient();
        const user = await CreateUser();
        await user.save();

        const userCookies = generateUserCookies(user);

        res.setHeader("Set-Cookie", [userCookies.uid, userCookies.secret, userCookies.registered]);
    }
    return res.status(200).json({success: "ok"});
};
