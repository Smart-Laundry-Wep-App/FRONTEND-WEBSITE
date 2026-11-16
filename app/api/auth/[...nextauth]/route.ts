import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const { handlers } = NextAuth({
  providers: [GoogleProvider],
});

export const { GET, POST } = handlers;
