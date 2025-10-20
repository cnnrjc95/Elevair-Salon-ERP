import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string;
      email?: string | null;
      name?: string | null;
      roleAssignments?: Array<{
        role: { name: string };
        location: { id: string; name: string } | null;
      }>;
    };
  }
}
