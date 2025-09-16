import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { AuthOptions } from "next-auth";
import db from "../../../packages/db/src";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            console.log("hi signin");
            
            // Type guards to ensure we have the required data
            if (!user || !user.email || !account) {
                return false;
            }

            // Additional check for supported providers
            if (account.provider !== "google" && account.provider !== "github") {
                return false;
            }

            try {
                await db.merchant.upsert({
                    select: {
                        id: true
                    },
                    where: {
                        email: user.email
                    },
                    create: {
                        email: user.email,
                        name: user.name || "", // Handle potential null name
                        auth_type: account.provider === "google" ? "Google" : "Github"
                    },
                    update: {
                        name: user.name || "", // Handle potential null name
                        auth_type: account.provider === "google" ? "Google" : "Github"
                    }
                });

                return true;
            } catch (error) {
                console.error("Error upserting merchant:", error);
                return false;
            }
        }
    },
    secret: process.env.NEXTAUTH_SECRET || "secret"
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };