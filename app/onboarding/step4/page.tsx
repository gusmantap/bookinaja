'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getAllThemes, getThemesByCategory } from '@/lib/themes';
import type { Theme } from '@/types';

export default function OnboardingStep4() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    // Load from sessionStorage
    const savedStep1 = sessionStorage.getItem('onboarding_step1');

    if (savedStep1) {
      const step1Data = JSON.parse(savedStep1);
      setCategory(step1Data.category || '');
    }

    const savedTheme = sessionStorage.getItem('onboarding_step4');
    if (savedTheme) {
      setSelectedTheme(savedTheme);
    }
  }, []);

  const allThemes = getAllThemes();
  const recommendedThemes = category ? getThemesByCategory(category) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save theme selection to sessionStorage
      sessionStorage.setItem('onboarding_step4', selectedTheme);

      // Get all data from sessionStorage
      const subdomain = sessionStorage.getItem('onboarding_subdomain');
      const step1Data = sessionStorage.getItem('onboarding_step1');
      const step2Data = sessionStorage.getItem('onboarding_step2');
      const step3Data = sessionStorage.getItem('onboarding_step3');

      if (!subdomain || !step1Data || !step2Data || !step3Data) {
        alert('Data onboarding tidak lengkap. Mulai dari awal.');
        router.push('/onboarding/step1');
        return;
      }

      if (!session?.user?.id) {
        alert('Session tidak ditemukan. Silakan login kembali.');
        router.push('/login');
        return;
      }

      const businessData = {
        subdomain,
        ...JSON.parse(step1Data),
        services: JSON.parse(step2Data),
        operatingHours: JSON.parse(step3Data),
        theme: selectedTheme,
        userId: session.user.id,
      };

      // Call API endpoint to create business
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuat bisnis');
      }

      // Update session to mark onboarding as completed
      await update({
        onboardingCompleted: true,
      });

      // Clear sessionStorage
      sessionStorage.removeItem('onboarding_subdomain');
      sessionStorage.removeItem('onboarding_step1');
      sessionStorage.removeItem('onboarding_step2');
      sessionStorage.removeItem('onboarding_step3');
      sessionStorage.removeItem('onboarding_step4');

      // Redirect to business public page
      router.push(`/${data.data.slug}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getThemePreview = (theme: Theme) => {
    return {
      header: theme.headerGradient,
      button: theme.buttonGradient,
      accent: theme.accentColor,
    };
  };

  const isRecommended = (themeName: string) => {
    return recommendedThemes.some(t => t.name === themeName);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step 4 of 4</span>
            <span className="text-sm font-medium text-zinc-600">100%</span>
          </div>
          <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">Pilih Tema Website</h1>
            <p className="text-zinc-600">
              Pilih tema yang sesuai dengan bisnis Anda.
              {category && <span className="font-semibold"> Kami merekomendasikan tema untuk {category}.</span>}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recommended Themes */}
            {recommendedThemes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                  <span className="text-xl">⭐</span>
                  Direkomendasikan untuk Anda
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedThemes.map((theme) => {
                    const preview = getThemePreview(theme);
                    return (
                      <button
                        key={theme.name}
                        type="button"
                        onClick={() => setSelectedTheme(theme.name)}
                        className={`relative p-5 rounded-xl border-2 transition-all text-left ${
                          selectedTheme === theme.name
                            ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                            : 'border-zinc-200 hover:border-blue-300 hover:bg-zinc-50 hover:scale-102'
                        }`}
                      >
                        {/* Recommended Badge */}
                        <div className="absolute top-3 right-3 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-md">
                          ⭐ RECOMMENDED
                        </div>

                        {/* Theme Name */}
                        <h4 className={`text-base font-bold mb-3 ${
                          selectedTheme === theme.name ? 'text-blue-700' : 'text-zinc-800'
                        }`}>
                          {theme.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </h4>

                        {/* Color Preview */}
                        <div className="space-y-2">
                          <div className={`h-8 ${preview.header} rounded-md`}></div>
                          <div className="flex gap-2">
                            <div className={`flex-1 h-6 ${preview.button} rounded`}></div>
                            <div className={`w-16 h-6 bg-${preview.accent}-500 rounded`}></div>
                          </div>
                        </div>

                        {/* Style Info */}
                        <div className="mt-3 text-xs text-zinc-500 flex gap-2">
                          <span className="px-2 py-1 bg-zinc-100 rounded">{theme.borderRadius}</span>
                          <span className="px-2 py-1 bg-zinc-100 rounded">{theme.fontWeight}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Themes */}
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">
                Semua Tema Tersedia
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allThemes.map((theme) => {
                  const recommended = isRecommended(theme.name);
                  const preview = getThemePreview(theme);

                  return (
                    <button
                      key={theme.name}
                      type="button"
                      onClick={() => setSelectedTheme(theme.name)}
                      className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                        selectedTheme === theme.name
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-zinc-200 hover:border-blue-300 hover:bg-zinc-50'
                      }`}
                    >
                      {/* Theme Name */}
                      <h4 className={`text-sm font-bold mb-2 ${
                        selectedTheme === theme.name ? 'text-blue-700' : 'text-zinc-700'
                      }`}>
                        {theme.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </h4>

                      {/* Color Preview */}
                      <div className="space-y-1.5">
                        <div className={`h-6 ${preview.header} rounded`}></div>
                        <div className="flex gap-1.5">
                          <div className={`flex-1 h-4 ${preview.button} rounded`}></div>
                          <div className={`w-12 h-4 bg-${preview.accent}-500 rounded`}></div>
                        </div>
                      </div>

                      {/* Category Tag */}
                      <div className="mt-2 text-xs text-zinc-500">
                        {theme.category}
                      </div>

                      {/* Selected Checkmark */}
                      {selectedTheme === theme.name && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border-2 border-zinc-300 text-zinc-700 rounded-xl font-semibold hover:bg-zinc-50 transition-all"
              >
                ← Kembali
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedTheme}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Membuat Bisnis...' : '✨ Selesai & Buat Bisnis'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
