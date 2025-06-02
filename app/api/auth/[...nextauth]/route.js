import { authOptions } from "@/lib/auth.js";

export const GET = async (req, res) => {
  const NextAuth = (await import("next-auth")).default;
  return NextAuth(req, res, authOptions);
};

export const POST = async (req, res) => {
  const NextAuth = (await import("next-auth")).default;
  return NextAuth(req, res, authOptions);
};