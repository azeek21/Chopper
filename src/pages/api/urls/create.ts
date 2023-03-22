import mongoClient from "@/db/connect";
import CreateUrl from "@/db/create-url";
import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"
import getUser from "@/db/get-user";
dayjs.extend(customParseFormat);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;

    const uid = req.cookies;
    console.log(uid);


    if (method == "POST") {
        const data = JSON.parse(req.body);
        console.log("RECEIVED >>>");
        
        console.log(data);
        
        if (!data.to_url) {
            return res.status(400).json({error: "Missing to_url!"})
        };
        await mongoClient();
        const user = await getUser(req);
        if (!user) {
            res.status(400).json({error: "Bad request, No user found."});
            return ;
        }

        const url = await CreateUrl(user.uid, data.to_url, { password: data.password, limit: data.limit, timeout: data.timeout ? dayjs(data.timeout, "YYYY-MM-DD").unix() : undefined});
        await url.save();
        res.status(201).json({...url.toJSON(), timeout: url.timeout ? dayjs.unix(url.timeout).format("YYYY-MM-DD") : ""});
        if (user) {
            user.urls.push(url.urlid);
            await user.save();
        }
        return ;
    }

    res.status(400).json({error: "Bad request"});
}
