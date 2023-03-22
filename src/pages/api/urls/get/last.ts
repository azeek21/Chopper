import mongoClient from "@/db/connect";
import getUser from "@/db/get-user";
import UrlModel, { URL_DATA_INTERFACE } from "@/db/models/url-model";
import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await mongoClient();

  const user = await getUser(req);
  if (!user) {
    res.status(400).json({ error: "No url" });
    return;
  }

  if (!user.urls || !(user.urls.length > 0)) {
    res.status(400).json({ error: "No url" });
    return;
  }

  const url = await UrlModel.findOne<HydratedDocument<URL_DATA_INTERFACE>>({
    owner: user.uid,
    secret: user.secret
  }).sort({ created_at: "desc"}).exec();

  if (!url) {
    res.status(400).json({ error: "No url" });
    return ;
  }

    res.status(200).json(url);
  return ;
}
