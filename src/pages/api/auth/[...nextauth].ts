import mongoClient from "@/db/connect";
import getUser from "@/db/get-user";
import { PROVIDER_INTERFACE, USER_INTERFACE } from "@/db/models/user-model";
import clientPromise from "@/lib/mongodb";
import { userHasProvider } from "@/utils/provider-utils";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { serialize } from "cookie";
import dayjs from "dayjs";
import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { AuthOptions, NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import YandexProvider from "next-auth/providers/yandex";

const max_age = "Fri, 31 Dec 9999 21:10:10 GMT";

const removeCookies = (res: NextApiResponse) => {
  res.setHeader("Set-Cookie", [
    serialize("weak-uid", "", {
      maxAge: -1,
      path: "/",
    }),
    serialize("weak-secret", "", {
      maxAge: -1,
      path: "/",
    }),
    serialize("weak-registered", "true", {
      expires: dayjs().add(999, "year").toDate(),
      sameSite: "lax",
      path: "/",
    }),
  ]);
};

const handleCopy = async (
  user: HydratedDocument<USER_INTERFACE> | null,
  provider: PROVIDER_INTERFACE,
  profile: { name: string | null; email: string | null; image?: string }
) => {
  if (user && !userHasProvider(user, provider)) {
    console.log("USER EXISTS, COPYING DATA>>>");
    console.log(user);
    user.registered = true;
    user.email = profile.email || user.email || undefined;
    user.name = profile.name || user.name || undefined;
    if (profile.image && !user.image_url) {
      user.image_url = profile.image;
    }
    if (user.providers && user.providers.length >= 1) {
      user.providers.push(provider);
    } else {
      user.providers = [provider];
    }
    user.markModified("providers");
    await user.save();
  }
};

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [],
  // adapter
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: "poiuytrewasdfghyhnhyhnhyhnvgfgfde4567898765fgfggff!#j$d1*j",
  },
  callbacks: {
    jwt: async (params) => {
      if (params.user) {
        params.token.uid = params.user?.uid;
        params.token.secret = params.user?.secret;
      }
      return params.token;
    },
    session: async ({ session, user, token }) => {
      if (session.user) {
        session.user.uid = token.uid as string;
        session.user.secret = token.secret as string;
      }
      return session;
    },
  },
  events: {
    createUser: async (message) => {
      console.log("USER CREATE EVENT >>>");
      console.log(message);
    },
  },
  theme: {
    colorScheme: "auto",
    brandColor: "#9034a0",
    logo: "/axe.png",
    buttonText: "#9034a0",
  },
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  let user: null | HydratedDocument<USER_INTERFACE>;

  const customGithubProvider = GithubProvider({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_SECRET!,
    profile: async (profile) => {
      await mongoClient();
      user = await getUser(req, {
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

  const customGoogleProvider = GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    profile: async (profile) => {
      console.log("GOOGLE PROVIDER >>>");
      console.log(profile);
      console.log("-------------------G-");
      await mongoClient();

      user = await getUser(req, {
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

  const customDiscordProvider = DiscordProvider({
    clientId: process.env.DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    profile: async (profile) => {
      console.log("DISCORD PROFILE");
      console.log(profile);
      console.log("----------");
      await mongoClient();

      user = await getUser(req, {
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

  console.log("INFO >>>");
  console.log(process.env.YANDEX_CLIENT_ID);
  console.log(process.env.YANDEX_CLIENT_SECRET);
  console.log("---------- I");

  const customYandexProvider = YandexProvider({
    clientId: process.env.YANDEX_CLIENT_ID!,
    clientSecret: process.env.YANDEX_CLIENT_SECRET!,
    profile: async (profile) => {
      console.log("YANDEX PROVIDER");
      console.log(profile);
      console.log("-------- Y");
      await mongoClient();
      user = await getUser(req, { name: "yandex", id: profile.id });

      removeCookies(res);

      const image_url = profile.is_avatar_empty
        ? null
        : `https://avatars.yandex.net/get-yapic/${profile.default_avatar_id}/islands-200`;

      // copy data
      await handleCopy(
        user,
        { name: "yandex", id: profile.id },
        {
          name: profile.display_name,
          email: profile.default_email,
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
  return await NextAuth(req, res, {
    ...authOptions,
    providers: [
      customGithubProvider,
      customGoogleProvider,
      customDiscordProvider,
      customYandexProvider,
    ],
  });
}
