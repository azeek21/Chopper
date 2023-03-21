import NextAuth, { AuthOptions, CallbacksOptions, NextAuthOptions, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getCookie } from "@/utils/cookie";
import mongoClient from "@/db/connect";
import getUser from "@/db/get-user";
import { HydratedDocument } from "mongoose";
import { USER_INTERFACE } from "@/db/models/user-model";

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
      console.log(params);
      return params.token;
    },
    session: async ({session, user, token}) => {
      console.log("CUSTOM authOPtions: SESSION REQUESTED >>>");
      console.log(session);
      console.log(user);
      console.log(token);

      return session;
    },
    
  }

  const customGithubProvider = GithubProvider({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_SECRET!,
    async profile(profile, tokens) {
      console.log("WRITING USER TO DATABASE WITH PROFILE METHOD >>>");
      console.log(profile);
      console.log(tokens);

      // if (!req.cookies["weak-uid"]) {
      //   console.log("SERVER: NO COOKIE... ASKING ....");
      //   const _ = mongoClient();
      //   const resp = await fetch("http://localhost:3000/api/new-user");
      //   await _;
      //   console.log(resp);
      //   user = await getUser(req);
      // }

      return {
        // uid: user?.uid,
        // secret: user?.secret,
        // registered: true,
        // urls: user?.urls,
        // has_access_to: user?.has_access_to,
        // retries: user?.retries,
        id: profile.id.toString(),
        email: profile.email,
        name: profile.name,
        custom: "FUCK YOU",
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
