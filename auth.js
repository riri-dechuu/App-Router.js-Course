// auth.js
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

// PostgreSQL connection
const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

// Get user from database by email
async function getUser(email) {
  try {
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    return users[0]; // Return first user
  } catch (err) {
    console.error('Failed to fetch user:', err);
    return undefined;
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      async authorize(credentials) {
        // Validate credentials
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log('Invalid credentials format');
          return null;
        }

        const { email, password } = parsedCredentials.data;

        // Look up the user
        const user = await getUser(email);
        if (!user) {
          console.log('No user found');
          return null;
        }

        // Compare passwords
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          console.log('Incorrect password');
          return null;
        }

        // All checks pass - return the user object (NextAuth.js will use this to create the session)
        return user;
      },
    }),
  ],
  // --- ADD THESE CALLBACKS ---
  callbacks: {
    async jwt({ token, user }) {
      // Add user ID to the token if it exists (on initial sign-in)
      if (user) {
        token.id = user.id; // Assuming your user object from getUser has an 'id' property
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID from the token to the session object
      // This is what `auth()` in your components will receive
      if (token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  // --- END OF CALLBACKS ---
});