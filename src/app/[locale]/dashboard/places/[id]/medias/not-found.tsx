'use client';
import { Link } from '@/navigation';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import requireAuth from '@/auth';

function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>No hem pogut trobar el Monum:</p>
      <Link
        href="/dashboard/places/list"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Tornar enrera
      </Link>
    </main>
  );
}

export default requireAuth(NotFound);
