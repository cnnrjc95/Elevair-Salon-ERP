import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { compare } from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { prisma } from '@/server/db/client';
import { RoleName } from '@prisma/client';
import { z } from 'zod';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database', maxAge: 60 * 60 * 8 },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      name: 'Email & Password',
      credentials: { email: { label: 'Email' }, password: { label: 'Password', type: 'password' } },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }
        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
        if (!user?.passwordHash) {
          return null;
        }
        const valid = await compare(parsed.data.password, user.passwordHash);
        if (!valid) {
          return null;
        }
        return { id: user.id, email: user.email, name: `${user.firstName} ${user.lastName}` };
      }
    }),
    Google({
      allowDangerousEmailAccountLinking: true,
      clientId: process.env.GOOGLE_CLIENT_ID ?? 'placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? 'placeholder'
    })
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.roleAssignments = await prisma.userRole.findMany({
          where: { userId: user.id },
          select: { role: true, location: { select: { id: true, name: true } } }
        });
      }
      return session;
    },
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }
      const existing = await prisma.user.findUnique({ where: { email: user.email }, include: { roles: true } });
      if (!existing) {
        await prisma.user.create({
          data: {
            email: user.email,
            firstName: user.name?.split(' ')[0] ?? 'Google',
            lastName: user.name?.split(' ')[1] ?? 'User',
            roles: {
              create: {
                role: {
                  connect: {
                    name: RoleName.RECEPTION
                  }
                }
              }
            }
          }
        });
      }
      return true;
    }
  }
};
