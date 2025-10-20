import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth/options';
import { unauthorized } from './response';

export const requireAuth = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { response: unauthorized(), session: null } as const;
  }
  return { response: null, session } as const;
};
