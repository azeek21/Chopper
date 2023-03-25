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
import { AdapterUser } from "next-auth/adapters";
import customGithubProvider from "@/utils/custom-github-provider";
import customGoogleProvider from "@/utils/custom-google-provider";
import customDiscordProvider from "@/utils/custom-discord-provider";
import customYandexProvider from "@/utils/custom-yandex-provider";

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
    secret: process.env.NEXTAUTH_SECRET!,
  },
  callbacks: {
    jwt: async (params: any) => {
      const user: {uid: string, secret: string} & AdapterUser = params.user;
      if (user) {
        params.token.uid = user.uid;
        params.token.secret = user.secret;
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
  theme: {
    colorScheme: "auto",
    brandColor: "#9034a0",
    logo: "/axe.png",
    buttonText: "#9034a0",
  },
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {

  return await NextAuth(req, res, {
    ...authOptions,
    providers: [
      customGithubProvider(req, res),
      customGoogleProvider(req,res),
      customDiscordProvider(req, res),
      customYandexProvider(req, res),
    ],
  });
}
