import clientPromise from "@/lib/mongodb";
import customDiscordProvider from "@/utils/custom-discord-provider";
import customGithubProvider from "@/utils/custom-github-provider";
import customGoogleProvider from "@/utils/custom-google-provider";
import customYandexProvider from "@/utils/custom-yandex-provider";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

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
      const user: { uid: string; secret: string } & AdapterUser = params.user;
      if (user) {
        params.token.uid = user.uid;
        params.token.secret = user.secret;
      }
      return params.token;
    },
    session: async ({ session, token }) => {
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
      customGoogleProvider(req, res),
      customDiscordProvider(req, res),
      customYandexProvider(req, res),
    ],
  });
}
