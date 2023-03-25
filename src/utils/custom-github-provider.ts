import mongoClient from "@/db/connect";
import removeCookies from "./remove-cookies";
import handleCopy from "./handle-user-copy";
import getUser from "@/db/get-user";
import { NextApiRequest, NextApiResponse } from "next";
import Github from "next-auth/providers/github";

export default function customGithubProvider(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return Github({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_SECRET!,
    profile: async (profile) => {
      await mongoClient();
      const user = await getUser(req, {
        name: "github",
        id: profile.id.toString(),
      });

      // removing before-register cookies
      removeCookies(res);

      // check and copy data
      await handleCopy(
        user,
        { name: "github", id: profile.id.toString() },
        { name: profile.name, email: profile.email, image: profile.avatar_url }
      );

      return {
        id: profile.id.toString(),
        email: profile.email,
        name: profile.name,
        uid: user?.uid || null,
        secret: user?.secret || null,
        image: profile.avatar_url,
      };
    },
  });
}
