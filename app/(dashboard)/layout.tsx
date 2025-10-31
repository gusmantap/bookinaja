'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if user is owner (TODO: Replace with real auth check)
  const isOwner = true; // This should come from auth context/session
  const slug = 'komet'; // TODO: Get from session/auth

  if (!isOwner) {
    return <>{children}</>;
  }

  // Check if current route is in settings
  const isSettingsActive = pathname?.startsWith('/settings');

  return (
    <div className="relative min-h-screen pb-16">
      {/* Header dengan Preview Website Icon */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-zinc-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Title */}
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-zinc-900">Bookinaja</h1>
                <p className="text-xs text-zinc-500 hidden sm:block">Komet Barbershop</p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Preview Website Button */}
              <Link
                href={`/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-sm hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm"
                title="Preview website publik"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <span className="hidden sm:inline">Preview</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content dengan padding top untuk header */}
      <div className="pt-14">
        {children}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t-2 border-zinc-200 shadow-2xl">
        <div className="max-w-lg mx-auto px-2">
          <div className="grid grid-cols-4 gap-1">
            {/* Dashboard */}
            <Link
              href="/dashboard"
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all ${
                pathname === '/dashboard'
                  ? 'text-blue-600'
                  : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                {pathname === '/dashboard' && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${pathname === '/dashboard' ? 'text-blue-600' : ''}`}>
                Dashboard
              </span>
            </Link>

            {/* Layanan */}
            <Link
              href="/services"
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all ${
                pathname?.startsWith('/services')
                  ? 'text-purple-600'
                  : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                {pathname?.startsWith('/services') && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full"></div>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${pathname?.startsWith('/services') ? 'text-purple-600' : ''}`}>
                Layanan
              </span>
            </Link>

            {/* Kelola Booking */}
            <Link
              href="/booking"
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all ${
                pathname?.startsWith('/booking')
                  ? 'text-green-600'
                  : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                {pathname?.startsWith('/booking') && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-600 rounded-full"></div>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${pathname?.startsWith('/booking') ? 'text-green-600' : ''}`}>
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
