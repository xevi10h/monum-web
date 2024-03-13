import { requireAuth } from '@/atuh';

function Loading() {
  return 'Loading...';
}

export default requireAuth(Loading);
