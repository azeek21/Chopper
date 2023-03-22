import NextAuth, {
  AuthOptions,
  CallbacksOptions,
  NextAuthOptions,
  User,
} from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getCookie } from "@/utils/cookie";
import mongoClient from "@/db/connect";
import getUser from "@/db/get-user";
import { HydratedDocument } from "mongoose";
import { USER_INTERFACE } from "@/db/models/user-model";
import { serialize } from "cookie";
import dayjs from "dayjs";

const max_age = "Fri, 31 Dec 9999 21:10:10 GMT";

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
  events: {
    createUser: async (message) => {
      console.log("USER CREATE EVENT >>>");
      console.log(message);
    },
  },
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  let user: null | HydratedDocument<USER_INTERFACE>;

  const customCallbacks: AuthOptions["callbacks"] = {
    jwt: async (params) => {
      console.log("CUSTOP authOptions: TOKE requested >>>");
      if (params.user) {
        console.log("toke: user>>>");
        console.log(params.user);
        params.token.uid = user?.uid;
        params.token.secret = user?.secret;
      }
      return params.token;
    },
    session: async ({ session, user, token }) => {
      console.log("CUSTOM authOPtions: SESSION REQUESTED >>>");
      if (session.user) {
        console.log("session: token>>> ");
        console.log(token);
        session.user.uid = token.uid;
        session.user.secret = token.secret;
      }

      return session;
    },
  };

  const customGithubProvider = GithubProvider({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_SECRET!,
    async profile(profile, tokens) {
      console.log("WRITING USER TO DATABASE WITH PROFILE METHOD >>>");
      console.log(req.cookies);
      console.log(profile);
      console.log(tokens);

      if (req.cookies["weak-uid"]) {
        console.log("REMOVING COOKIES >>>");
        await mongoClient();
        user = await getUser(req);

        // removing before-register cookies
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

        if (user) {
          console.log("USER EXISTS, COPYING DATA>>>");
          console.log(user);
          user.registered = true;
          user.email = profile.email || undefined;
          user.name = profile.name || undefined;
          await user.save();
        };
      }

      return {
        id: profile.id.toString(),
        email: profile.email,
        name: profile.name,
        custom: "FUCK YOU",
        uid: user?.uid || null,
        secret: user?.secret || null,
      };
    },
  });
  const transferUser = async (message: { user: User }) => {};

  return await NextAuth(req, res, {
    ...authOptions,
    providers: [customGithubProvider],
    callbacks: customCallbacks,
  });
}

// export default NextAuth(authOptions);
