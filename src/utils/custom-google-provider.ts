import mongoClient from "@/db/connect";
import removeCookies from "./remove-cookies";
import handleCopy from "./handle-user-copy";
import getUser from "@/db/get-user";
import { NextApiRequest, NextApiResponse } from "next";
import Google from "next-auth/providers/google";

export default function customGoogleProvider(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return Google({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    profile: async (profile) => {
      await mongoClient();

      const user = await getUser(req, {
        name: "google",
        id: profile.sub,
      });
      // remove cookies
      removeCookies(res);

      // copy data
      await handleCopy(
        user,
        { name: "google", id: profile.sub },
        { name: profile.name, email: profile.email, image: profile.picture }
      );

      return {
        id: profile.sub,
        email: profile.email,
        name: profile.name,
        uid: user?.uid || null,
        secret: user?.secret || null,
        image: profile.picture,
      };
    },
  });
}
