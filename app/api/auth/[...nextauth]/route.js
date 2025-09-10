import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        teamName: { label: "Team Name", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { teamName, password } = credentials;

        // ✅ Hardcoded Admin Login
        if (teamName === "admin" && password === "12345") {
          return { id: "1", name: "Admin", role: "admin" };
        }

        // ❌ If nothing matches, return null
        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login", // custom login page
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};
