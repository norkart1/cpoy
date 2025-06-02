import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/team-login",
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};