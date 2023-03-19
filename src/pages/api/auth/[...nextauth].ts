import NextAuth, { NextAuthOptions, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getCookie } from "@/utils/cookie";
import mongoClient from "@/db/connect";
import getUser from "@/db/get-user";

const max_age = "Fri, 31 Dec 9999 21:10:10 GMT";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
  ],
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

  if (req.cookies['weak-registered'] === undefined) {
    console.log("SERVER: NO COOKIE... ASKING ....");
    
    await fetch('http://localhost:3000/api/new-user');
  };
  await mongoClient();
  const user = await getUser(req);

  const customGithubProvider = GithubProvider({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_SECRET!,
    async profile(profile, tokens) {
      console.log("WRITING USER TO DATABASE WITH PROFILE METHOD >>>");
      console.log(profile);
      console.log(tokens);

      return {
        uid: user?.uid,
        secret: user?.secret,
        registered: true,
        urls: user?.urls,
        has_access_to: user?.has_access_to,
        retries: user?.retries,
        id: profile.id.toString(),
        email: profile.email,
        name: profile.name,
        custom: "FUCK YOU"
      }
    }
  })
  const transferUser = async (message: {user: User}) => {    
  }

  return await NextAuth(req, res, {...authOptions, providers: [customGithubProvider]});
}

// export default NextAuth(authOptions);
