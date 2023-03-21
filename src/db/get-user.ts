import { HydratedDocument } from "mongoose";
import { NextApiRequest } from "next";
import UserModel, { USER_INTERFACE } from "./models/user-model";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";

export default async function getUser(req: NextApiRequest) {
  const cookies = req.cookies;
  let uid: string | undefined;
  let secret: string | undefined;
  uid = cookies["weak-uid"];
  secret = cookies["weak-secret"];
  if (!uid) {
    const session = await getSession();
    uid = session?.user?.uid || undefined;
    secret = session?.user?.secret || undefined;
  }

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