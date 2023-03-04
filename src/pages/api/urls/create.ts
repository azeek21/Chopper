import mongoClient from "@/db/connect";
import CreateUrl from "@/db/create-url";
import UserModel, { USER_INTERFACE } from "@/db/models/user-model";
import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat);


// TODO: add timeout support (dayJS); check local time.
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

        const url = await CreateUrl(req.cookies['weak-uid'] || '', data.to_url, { password: data.password, limit: data.limit, timeout: data.timeout ? dayjs(data.timeout, "YYYY-MM-DD").unix() : undefined});
        await url.save();

        res.status(201).json({data: {...url.toJSON(), timeout: url.timeout ? dayjs.unix(url.timeout).format("YYYY-MM-DD") : ""}});
        const user = await UserModel.findOne<HydratedDocument<USER_INTERFACE>>({uid: req.cookies['weak-uid'], secret: req.cookies['weak-secret']}).exec();
        if (user) {
            user.urls.push(url.urlid);
            await user.save();
        }
        return ;
    }

    res.status(400).json({err: "BAD"})
}
