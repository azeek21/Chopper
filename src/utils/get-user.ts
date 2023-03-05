import UserModel, { USER_INTERFACE } from "@/db/models/user-model";
import { HydratedDocument } from "mongoose";
import { NextApiRequest } from "next";

export default async function getUser(req: NextApiRequest) {
  const cookies = req.cookies;
  const weakUid = cookies["weak-uid"];
  const weakSecret = cookies["weak-secret"];
  if (!weakUid || !weakSecret) {
    return null;
  }

  const user = await UserModel.findOne<HydratedDocument<USER_INTERFACE>>({
    uid: weakUid,
    secret: weakSecret,
  }).exec();
  return user;
}
