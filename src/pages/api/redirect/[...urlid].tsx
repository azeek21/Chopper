import UrlModel, { URL_DATA_INTERFACE } from "@/db/models/url-model";
import { serialize } from "cookie";
import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import mongoClient from "@/db/connect";
import CreateUser from "@/db/create-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    console.log("POST>>>");
    console.log(req.query.urlid);
    const url = await UrlModel.findOne<HydratedDocument<URL_DATA_INTERFACE>>({
      urlid: req.query.urlid,
    }).exec();

    const data = req.body;
    if (data.password && url && url?.password == data.password) {

        if (data.remember) {
            await mongoClient();
            const user = await CreateUser();
            if (!user.has_access_to) {
                user.has_access_to = [url.urlid];
            } else if (user.has_access_to && !(user.has_access_to.includes(url.urlid))) {
                user.has_access_to.push(url.urlid);
            }
            await user.save();
        }

      res.redirect(url?.to_url);
      res.end();
      return ;

    } else {
      const cookies = req.cookies;
      await mongoClient();
      const user = await CreateUser();
      await user.save();

      if (!cookies["weak-uid"] || !cookies["weak-secret"]) {

        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        const weakUid = serialize("weak-uid", user.uid, {
          path: "/",
          expires: date,
          sameSite: true,
        });

        const weakSecret = serialize("weak-secret", user.uid, {
            path: "/",
            expires: date,
            sameSite: true,
          });

      }
      res.redirect("/" + url?.urlid);
    }
  }
}
