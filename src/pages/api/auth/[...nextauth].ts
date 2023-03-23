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
  profile: { name: string | null; email: string | null }
) => {
  if (user && !userHasProvider(user, provider)) {
    console.log("USER EXISTS, COPYING DATA>>>");
    console.log(user);
    user.registered = true;
    user.email = profile.email || user.email || undefined;
    user.name = profile.name || user.name || undefined;
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
        { name: profile.name, email: profile.email }
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

      // remove cookies
      removeCookies(res);

      // copy data
      await handleCopy(
        user,
        { name: "google", id: profile.sub },
        { name: profile.name, email: profile.email }
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

  return await NextAuth(req, res, {
    ...authOptions,
    providers: [customGithubProvider, customGoogleProvider],
  });
}
