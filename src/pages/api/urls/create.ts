import mongoClient from "@/db/connect";
import CreateUrl from "@/db/create-url";
import UserModel, { USER_INTERFACE } from "@/db/models/user-model";
import { UseTabReturnValue } from "@mui/base";
import { randomUUID } from "crypto";
import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;

    const uid = req.cookies;
    console.log(uid);


    if (method == "POST") {
        const data = JSON.parse(req.body);
        if (!data.to_url) {
            return res.status(400).json({error: "Missing to_url!"})
        };
        await mongoClient();
        
        const url = await CreateUrl(req.cookies['weak-uid'] || '', data.to_url);
        await url.save();
        res.status(201).send({data: url.toJSON()})
        const user = await UserModel.findOne<HydratedDocument<USER_INTERFACE>>({uid: req.cookies['weak-uid'], secret: req.cookies['weak-secret']}).exec();
        if (user) {
            user.urls.push(url.from_url);
            await user.save();
        }
        return ;
    }

    res.status(400).json({err: "BAD"})
}
