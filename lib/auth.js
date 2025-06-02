import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import Team from "../models/Team.js";
import Admin from "../models/Admin.js"
import  connectToDatabase  from "../lib/dbConnect.js";

const providers = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      teamName: { label: "teamName", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      console.log("Authorize - teamName:", credentials?.teamName, "password:", credentials?.password ? "[provided]" : "[missing]");
      
      try {
        await connectToDatabase();
      } catch (error) {
        console.error("Database connection failed:", error);
        throw new Error("Database connection failed");
      }

      if (!credentials?.teamName || !credentials?.password) {
        console.log("Missing teamName or password");
        throw new Error("Missing credentials");
      }

      const team = await Team.findOne({ teamName: credentials.teamName });
      if (!team) {
        console.log("Team not found:", credentials.teamName);
        throw new Error("Invalid team name or password");
      }

      const isValid = await bcrypt.compare(credentials.password, team.password);
      if (!isValid) {
        console.log("Invalid password for team:", credentials.teamName);
        throw new Error("Invalid team name or password");
      }

      console.log("Login successful for team:", team.teamName);
      return { id: team._id.toString(), name: team.teamName };
    },
  }),
];

export const authOptions = {
  providers,
  pages: {
    signIn: "/team-login",
    error: "/team-login", // Redirect errors to login page
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.teamName = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.teamName = token.teamName;
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.includes("/api/auth/error")) {
        return `${baseUrl}/team-login?error=CredentialsSignin`;
      }
      return url.startsWith("/") ? `${baseUrl}${url}` : url;
    },
  },
};

export default NextAuth(authOptions);