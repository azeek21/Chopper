import mongoClient from "@/db/connect";
import getUser from "@/db/get-user";
import { NextApiRequest, NextApiResponse } from "next";
import YandexProvider from "next-auth/providers/yandex";
import handleCopy from "./handle-user-copy";
import removeCookies from "./remove-cookies";

export default function customYandexProvider(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return YandexProvider({
    clientId: process.env.YANDEX_CLIENT_ID!,
    clientSecret: process.env.YANDEX_CLIENT_SECRET!,
    profile: async (profile, token) => {
      await mongoClient();

      const user = await getUser(req, { name: "yandex", id: profile.id });

      removeCookies(res);

      const image_url = profile.is_avatar_empty
        ? null
        : `https://avatars.yandex.net/get-yapic/${profile.default_avatar_id}/islands-200`;

      // copy data
      await handleCopy(
        user,
        { name: "yandex", id: profile.id },
        {
          name: profile.display_name!,
          email: profile.default_email!,
          image: image_url || "",
        }
      );

      return {
        id: profile.id,
        email: profile.default_email,
        name: profile.display_name,
        uid: user?.uid || null,
        secret: user?.secret || null,
        image: image_url,
      };
    },
  });
}
