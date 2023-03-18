import NextAuth, { NextAuthOptions, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

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

  const customGithubProvider = GithubProvider({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_SECRET!,
    profile(profile, tokens) {
      console.log("WRITING USER TO DATABASE WITH PRFILE METHOD >>>");
      console.log(profile);
      console.log(tokens);
      
      return {
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
