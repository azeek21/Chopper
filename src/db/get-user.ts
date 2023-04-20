import { HydratedDocument } from "mongoose";
import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import UserModel, { USER_INTERFACE } from "./models/user-model";

export interface PROVIDER_OPTIONS {
  id: string;
  name: string;
  // forces to search for user only by provider and return null if not found
  // meaning if user can't be found function returns null even user can be found by req.cookies or secret and uid
  onlyWithProvider?: boolean;
}
export default async function getUser(
  req: NextApiRequest,
  provider?: PROVIDER_OPTIONS
) {
  const cookies = req.cookies;
  let uid: string | undefined;
  let secret: string | undefined;
  let user = null;

  if (provider) {
    user = await UserModel.findOne<HydratedDocument<USER_INTERFACE>>({
      "providers.name": provider.name,
      "providers.id": provider.id,
    }).exec();
    if (user) {
      return user;
    }
    if (provider.onlyWithProvider) {
      return null;
    }
  }

  uid = cookies["weak-uid"];
  secret = cookies["weak-secret"];
  const registered = cookies["weak-registered"];

  if (!registered && !uid) {
    return null;
  }

  if (!uid && registered) {
    const session = await getToken({ req });
    if (session) {
      secret = session.secret as string | undefined;
      uid = session.uid as string | undefined;
    }
  }

  if (!uid || !secret) {
    return null;
  }

  try {
    user = await UserModel.findOne<HydratedDocument<USER_INTERFACE>>({
      uid: uid,
      secret: secret,
    }).exec();
  } catch (err) {
    // TODO do something about this
  }

  return user;
}
