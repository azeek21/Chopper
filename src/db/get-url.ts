import { HydratedDocument } from "mongoose";
import { NextApiRequest } from "next";
import getUser from "./get-user";
import UrlModel, { URL_DATA_INTERFACE } from "./models/url-model";
import { USER_INTERFACE } from "./models/user-model";

export default async function getUrl(
  req: NextApiRequest,
  urlid: string,
  user?: USER_INTERFACE | null
) {
  user = !user ? await getUser(req) : user;
  if (!user || !urlid) {
    return null;
  }
  const url = await UrlModel.findOne<HydratedDocument<URL_DATA_INTERFACE>>({
    urlid: urlid,
    owner: user.uid,
  }).exec();
  return url;
}
