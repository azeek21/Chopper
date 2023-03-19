import { HydratedDocument } from "mongoose";
import { NextApiRequest } from "next";
import UserModel, { USER_INTERFACE } from "./models/user-model";
import { getServerSession } from "next-auth";

export default async function getUser(req: NextApiRequest) {
  const cookies = req.cookies;
  const session = await getServerSession();
  let uid = "";
  let secret = "";
  if (!session) {
    uid = cookies["weak-uid"];
    secret = cookies["weak-secret"];
  } else {
    uid = session.user?.uid;
    secret = session.user?.secret;
  };

  if (!uid || !secret) {
    return null;
  }
  let user = null;
  try {
    user = await UserModel.findOne<HydratedDocument<USER_INTERFACE>>({
      uid: uid,
      secret: secret,
    }).exec();
  } catch (err) {
    console.error(err);
  }

  return user;
}