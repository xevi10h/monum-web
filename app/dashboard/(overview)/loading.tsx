'use client';
import requireAuth from '@/atuh';

function Loading() {
  return 'Carregant...';
}

export default requireAuth(Loading);
