import { HydratedDocument } from "mongoose";
import { NextApiRequest } from "next";
import UserModel, { USER_INTERFACE } from "./models/user-model";

export default async function getUser(req: NextApiRequest) {
    const cookies = req.cookies;
    const uid = cookies['weak-uid'];
    const secret = cookies['weak-secret'];
    if (!uid || !secret) {
        return null;
    }
    let user = null;
    try {
        user = await UserModel.findOne<HydratedDocument<USER_INTERFACE>>({uid: uid, secret: secret}).exec();
    } catch (err) {
        console.error(err);
    }

    return user;
}