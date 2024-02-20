import NextAuth, { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";
import { compare } from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "sign in",
            credentials: {
                email: {
                    label: "email",
                    type: "email",
                },
                password: {
                    label: "password",
                    type: "password",
                }
            },
            authorize: async credentials => {
                if (!credentials?.email || !credentials.password) return null;

                const user = await db.user.findFirst({
                    where: {
                        email: credentials.email,
                    }
                });

                if (!user) return null;

                const isPasswordValid = await compare(credentials.password, user.password);
                if (!isPasswordValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                };
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.username = token.username;
            }

            return session;
        },
        async jwt({ token, user }) {
            const prismaUser = await db.user.findFirst({
                where: {
                    email: token.email
                }
            });

            if (prismaUser) {
                token.id = user.id;
                return token;
            }

            if (!prismaUser.username) {
                await db.user.update({
                    where: {
                        id: prismaUser.id
                    },
                    data: {
                        username: prismaUser.name?.split(" ").join("").toLowerCase()
                    }
                });
            }

            return {
                id: prismaUser.id,
                name: prismaUser.name,
                email: prismaUser.email,
                username: prismaUser.username,
                image: prismaUser.image,
            }
        }
    },
    pages: {
        signIn: "/login",
        signOut: "/logout"
    },
    adapter: PrismaAdapter(db),
}
export default NextAuth(authOptions);

export function auth(...args) {
    return getServerSession(...args, authOptions);
}