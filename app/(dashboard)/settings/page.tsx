'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SettingsPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  // Dummy data - akan diganti dengan data dari session
  const user = {
    name: 'John Doe',
    email: 'john@komet.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff',
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      // Clear session/cookies
      router.push('/');
    }
  };

  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* User Profile Card */}
        <Link
          href="/settings/user-profile"
          className="block bg-white rounded-2xl p-4 mb-6 border-2 border-zinc-200 hover:border-blue-300 transition-all shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-zinc-900 truncate">{user.name}</h2>
              <p className="text-sm text-zinc-500 truncate">{user.email}</p>
            </div>
            <svg className="w-5 h-5 text-zinc-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </Link>

        {/* Account Settings Section */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 px-2">Account Settings</h3>
          <div className="bg-white rounded-2xl border-2 border-zinc-200 shadow-sm overflow-hidden">
            <Link
              href="/settings/user-profile"
              className="flex items-center gap-4 p-4 hover:bg-zinc-50 transition-colors border-b border-zinc-100"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-zinc-900">My Profile</div>
                <div className="text-xs text-zinc-500">Name, email, personal info</div>
              </div>
              <svg className="w-5 h-5 text-zinc-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>

            <Link
              href="/settings/change-password"
              className="flex items-center gap-4 p-4 hover:bg-zinc-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-zinc-900">Change Password</div>
                <div className="text-xs text-zinc-500">Update your password</div>
              </div>
              <svg className="w-5 h-5 text-zinc-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>

        {/* Company Settings Section - RBAC: Only for owners */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 px-2">Company Settings</h3>
          <div className="bg-white rounded-2xl border-2 border-zinc-200 shadow-sm overflow-hidden">
            <Link
              href="/settings/company-profile"
              className="flex items-center gap-4 p-4 hover:bg-zinc-50 transition-colors border-b border-zinc-100"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-zinc-900">Company Profile</div>
                <div className="text-xs text-zinc-500">Business name, address, social media</div>
              </div>
              <svg className="w-5 h-5 text-zinc-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>

            <Link
              href="/settings/invite"
              className="flex items-center gap-4 p-4 hover:bg-zinc-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-zinc-900">Team Members</div>
                <div className="text-xs text-zinc-500">Invite admins and staff</div>
              </div>
              <svg className="w-5 h-5 text-zinc-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 px-2">Notifications</h3>
          <div className="bg-white rounded-2xl border-2 border-zinc-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                </div>
                <span className="text-base font-semibold text-zinc-900">Notifications</span>
              </div>
              <button
                className="relative w-12 h-7 rounded-full bg-cyan-500"
              >
                <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md translate-x-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Regional Section */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 px-2">Regional</h3>
          <div className="bg-white rounded-2xl border-2 border-zinc-200 shadow-sm overflow-hidden">
            <Link
              href="/settings/language"
              className="flex items-center gap-4 p-4 hover:bg-zinc-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                </svg>
              </div>
              <span className="flex-1 text-base font-semibold text-zinc-900">Language</span>
              <svg className="w-5 h-5 text-zinc-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mb-6">
          <button
            onClick={handleLogout}
            className="w-full bg-white rounded-2xl border-2 border-zinc-200 shadow-sm overflow-hidden hover:bg-red-50 hover:border-red-200 transition-all"
          >
            <div className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </div>
              <span className="flex-1 text-left text-base font-semibold text-red-600">Logout</span>
              <svg className="w-5 h-5 text-zinc-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </button>
        </div>

        {/* App Version */}
        <div className="text-center text-sm text-zinc-400 mb-8">
          App ver 2.0.1
        </div>
      </div>
    </div>
  );
}
