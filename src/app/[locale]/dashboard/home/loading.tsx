'use client';
import requireAuth from '@/auth';
import { useTranslations } from 'next-intl';

function Loading() {
  const t = useTranslations('Generic');
  return t('loading');
}

export default requireAuth(Loading);
