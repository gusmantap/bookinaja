'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to step 1
    router.replace('/onboarding/step1');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-zinc-600">Memuat onboarding...</p>
      </div>
    </div>
  );
}
