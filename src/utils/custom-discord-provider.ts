import Discord from "next-auth/providers/discord";
import mongoClient from "@/db/connect";
import removeCookies from "./remove-cookies";
import handleCopy from "./handle-user-copy";
import getUser from "@/db/get-user";
import { NextApiRequest, NextApiResponse } from "next";

export default function customDiscordProvider(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return Discord({
    clientId: process.env.DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    profile: async (profile) => {
      await mongoClient();

      const user = await getUser(req, {
        name: "discord",
        id: profile.id,
      });
      // remove cookies
      removeCookies(res);

      if (profile.avatar === null) {
        const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
        profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
      } else {
        const format = profile.avatar.startsWith("a_") ? "gif" : "png";
        profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
      }

      // copy data
      await handleCopy(
        user,
        { name: "discord", id: profile.id },
        {
          name: profile.global_name || profile.display_name || profile.username,
          email: profile.email,
          image: profile.image_url,
        }
      );

      return {
        id: profile.id,
        email: profile.email,
        name: profile.global_name || profile.display_name || profile.username,
        uid: user?.uid || null,
        secret: user?.secret || null,
        image: profile.image_url,
      };
    },
  });
}
