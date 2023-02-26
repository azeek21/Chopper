import NextAuth from "next-auth/next"
import GitHubProvider from "next-auth/providers/github"

export default NextAuth({
    // auth providers like github, google, apple
    providers: [
        GitHubProvider({
            // you get these below from github read more on readme of this repo
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
    ]
})

export {}