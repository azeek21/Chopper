import UrlModel, { URL_DATA_INTERFACE } from "@/db/models/url-model";
import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import mongoClient from "@/db/connect";
import CreateUser from "@/db/create-user";
import dayjs from "dayjs";
import getUser from "@/db/get-user";
import generateUserCookies from "@/utils/generate-user-cookies";
import {
  addRetryObject,
  createRetryObject,
  deleteRetryObject,
  getRetryObject,
  isAllowable,
  updateRetryObject,
} from "@/utils/retries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // stop and return 404 if reqest is not a POST
  if (req.method != "POST") {
    res.status(400).json({ message: "Bad request" });
    return;
  }

  await mongoClient();

  // get url from db
  const url = await UrlModel.findOne<HydratedDocument<URL_DATA_INTERFACE>>({
    urlid: req.query.urlid,
  }).exec();

  // if url doesn't exist
  if (!url) {
    res.status(404).json({ error: "No such url" });
    return;
  }

  // if url is not password protected
  if (!url.password) {
    // if url has timeout protection and is expired
    const now_unix = dayjs().unix();
    if (url.timeout && url.timeout <= now_unix) {
      res.status(404).json({ error: "Expired URL" });
      return;
    }

    // if url has click limit and limit was reached
    if (url.limit && url.clicks >= url.limit) {
      res.status(404).json({ error: "URL access limit reached" });
      return;
    }

    // all ok, redirecting non password protected url to destination;
    // increase number of clics by 1;
    url.clicks += 1;
    await url.save();
    // redirect ;
    res.redirect(url.to_url);
    return;
  }

  // if url is password protected
  if (url.password) {
    // get and check if user eixsts;
    let user = await getUser(req);
    if (!user) {
      // if user doesn't exist, put cookies so that we can recognise user later
      user = await CreateUser();
      await user.save();
      const userCookies = generateUserCookies(user);
      res.setHeader("Set-Cookie", [
        userCookies.uid,
        userCookies.secret,
        userCookies.registered,
      ]);
    }

    // check if user has been retrying;
    if (!isAllowable(user, url.urlid)) {
      res.status(400).json({
        message: "You are not allowed. Due to too many failed tries.",
      });
      return;
    }

    const user_password = req.body.password;

    // check if user provided password
    if (!user_password) {
      res.status(404).json({ error: "Password not provided" });
      return;
    }

    // if password didn't match
    if (user_password != url.password) {
      const retryObject = getRetryObject(user, url.urlid);
      // if this is first try
      if (!retryObject) {
        let newRetryObject = createRetryObject(url.urlid);
        newRetryObject.count += 1;
        addRetryObject(user, newRetryObject);
        await user.save();
        res.status(400).redirect("/" + url.urlid);
        return;
      }

      // add 1 to retry count cuz password was wrong
      retryObject.count += 1;

      // if user reached retry limit
      if (retryObject.count >= retryObject.max_retry_count) {
        if (!retryObject.last_cooldown_duration) {
          retryObject.last_cooldown_duration = 60 * 3; // three minutes
        } else {
          retryObject.last_cooldown_duration =
            retryObject.last_cooldown_duration * 2;
        }
        retryObject.cools_at =
          dayjs().unix() + retryObject.last_cooldown_duration;
        retryObject.count = 0;
        updateRetryObject(user, retryObject);
        await user.save();
        res.redirect("/" + url.urlid);
        return;
      }

      // password didn't match but retry count was not reached, update retry object with just incremented retry.count;
      updateRetryObject(user, retryObject);
      await user.save();
      res.status(400).redirect("/" + url.urlid);
      return;
    }

    // if password matches
    if (user_password === url.password) {
      // delete retries object as user knows the password;
      deleteRetryObject(user, url.urlid);

      // if user checked rember me
      if (req.body.remember) {
        if (!user.has_access_to) {
          user.has_access_to = [url.urlid];
        } else if (!user.has_access_to.includes(url.urlid)) {
          user.has_access_to.push(url.urlid);
        }
      }

      url.clicks += 1;
      try {
        await Promise.all([user.save(), url.save()]);
      } catch (error) {
        // url or user failed to save during redirection
        // set up here some kind of error reporting which reports to you instantly
        // a good example can be a telegram bot which sends you message in case of anything bad ...
      }
      res.status(200).redirect(url.to_url);
      return;
    }
  }
}
