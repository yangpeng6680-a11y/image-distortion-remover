import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: "999188124106-vr5ohml1q2acnnh3kq35e9t5o9v3o436.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  secret: "development-secret-change-in-production",
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    }
  }
})

export { handler as GET, handler as POST }
