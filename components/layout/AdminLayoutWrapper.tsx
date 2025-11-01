'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getThemesByCategory } from '@/lib/themes';

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  businessSlug: string;
  isOwner: boolean;
}

export default function AdminLayoutWrapper({ children, businessSlug, isOwner }: AdminLayoutWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [category, setCategory] = useState<string>('');
  const [isChangingTheme, setIsChangingTheme] = useState(false);

  // If not owner, just show the content without admin layout
  if (!isOwner) {
    return <>{children}</>;
  }

  // Fetch business data to get current theme and category
  useEffect(() => {
    async function fetchBusinessData() {
      try {
        const response = await fetch(`/api/business/${businessSlug}/theme`);
        const data = await response.json();
        if (data.theme) setCurrentTheme(data.theme);
        if (data.category) setCategory(data.category);
      } catch (error) {
        console.error('Error fetching business data:', error);
      }
    }
    fetchBusinessData();
  }, [businessSlug]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showThemeDropdown && !target.closest('.theme-dropdown-container')) {
        setShowThemeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showThemeDropdown]);

  const recommendedThemes = category ? getThemesByCategory(category) : [];

  const handleThemeChange = async (themeName: string) => {
    setIsChangingTheme(true);
    try {
      const response = await fetch(`/api/business/${businessSlug}/theme`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: themeName }),
      });

      if (response.ok) {
        setCurrentTheme(themeName);
        setShowThemeDropdown(false);
        // Refresh page to apply new theme
        router.refresh();
      } else {
        alert('Gagal mengubah tema');
      }
    } catch (error) {
      console.error('Error changing theme:', error);
      alert('Terjadi kesalahan');
    } finally {
      setIsChangingTheme(false);
    }
  };

  // Check if current route is in settings
  const isSettingsActive = pathname?.startsWith('/settings');

  // Owner is viewing their own website - wrap with admin layout
  return (
    <div className="relative min-h-screen pb-20">
      {/* Header Admin */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-zinc-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Title */}
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-zinc-900">Preview Mode</h1>
                <p className="text-xs text-zinc-500 hidden sm:block">Anda sedang melihat website Anda</p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Theme Switcher Dropdown */}
              <div className="relative theme-dropdown-container">
                <button
                  onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium text-sm hover:from-purple-700 hover:to-pink-700 transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  <span>Ganti Tema</span>
                  <svg className={`w-4 h-4 transition-transform ${showThemeDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showThemeDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border-2 border-zinc-200 z-50 max-h-[70vh] overflow-y-auto">
                    <div className="p-4">
                      {/* Category-specific Themes Only */}
                      {recommendedThemes.length > 0 ? (
                        <div>
                          <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3">
                            Tema untuk {category?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </h3>
                          <div className="space-y-2">
                            {recommendedThemes.map((theme) => (
                              <button
                                key={theme.name}
                                onClick={() => handleThemeChange(theme.name)}
                                disabled={isChangingTheme}
                                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                                  currentTheme === theme.name
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-zinc-200 hover:border-purple-300 hover:bg-zinc-50'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className={`text-sm font-semibold ${
                                    currentTheme === theme.name ? 'text-purple-700' : 'text-zinc-900'
                                  }`}>
                                    {theme.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                  </span>
                                  {currentTheme === theme.name && (
                                    <span className="text-purple-600 text-xs font-bold">✓ AKTIF</span>
                                  )}
                                </div>
                                {/* Theme Preview */}
                                <div className="flex gap-1">
                                  <div className={`flex-1 h-3 ${theme.headerGradient} rounded`}></div>
                                  <div className={`flex-1 h-3 ${theme.buttonGradient} rounded`}></div>
                                  <div className={`w-8 h-3 bg-${theme.accentColor}-500 rounded`}></div>
                                </div>
                                {/* Style Info */}
                                <div className="mt-2 flex gap-1">
                                  <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[10px]">
                                    {theme.borderRadius}
                                  </span>
                                  <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[10px]">
                                    {theme.fontWeight}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-4xl mb-2">🎨</div>
                          <p className="text-sm text-zinc-600 font-medium">Tidak ada tema tersedia</p>
                          <p className="text-xs text-zinc-500 mt-1">
                            Kategori bisnis belum diset atau tidak memiliki tema
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content dengan padding top untuk header */}
      <div className="pt-16">
        {children}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t-2 border-zinc-200 shadow-2xl">
        <div className="max-w-lg mx-auto px-2">
          <div className="grid grid-cols-4 gap-1">
            {/* Dashboard */}
            <Link
              href="/dashboard"
              className="flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50"
            >
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
              </div>
              <span className="text-[10px] mt-1 font-medium">
                Dashboard
              </span>
            </Link>

            {/* Layanan */}
            <Link
              href="/services"
              className="flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50"
            >
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <span className="text-[10px] mt-1 font-medium">
                Layanan
              </span>
            </Link>

            {/* Kelola Booking */}
            <Link
              href="/booking"
              className="flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50"
            >
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <span className="text-[10px] mt-1 font-medium">
                Booking
              </span>
            </Link>

            {/* Pengaturan */}
            <Link
              href="/settings"
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all ${
                isSettingsActive
                  ? 'text-amber-600'
                  : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {isSettingsActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-600 rounded-full"></div>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isSettingsActive ? 'text-amber-600' : ''}`}>
                Settings
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
