'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { TopGlassNav } from '@/components/top-glass-nav';
import { LoadingSpinner } from '@/components/states';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.push('/login');
    }
  }, [loading, token, router]);

  if (loading) return <LoadingSpinner className="h-screen" />;
  if (!token) return null;

  return (
    <div className="min-h-screen bg-background">
      <TopGlassNav />
      <main className="mx-auto max-w-7xl p-4 lg:p-8">{children}</main>
    </div>
  );
}
