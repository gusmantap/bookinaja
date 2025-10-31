'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type InvitedMember = {
  id: string;
  email: string;
  role: 'admin' | 'staff';
  status: 'pending' | 'accepted' | 'rejected';
  invitedAt: string;
};

export default function InviteMembersPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'staff'>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dummy data - akan diganti dengan data dari API
  const [invitedMembers, setInvitedMembers] = useState<InvitedMember[]>([
    {
      id: '1',
      email: 'admin@example.com',
      role: 'admin',
      status: 'accepted',
      invitedAt: '2025-10-25T10:00:00',
    },
    {
      id: '2',
      email: 'staff@example.com',
      role: 'staff',
      status: 'pending',
      invitedAt: '2025-10-28T14:30:00',
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validasi email
    if (!email || !email.includes('@')) {
      setError('Email tidak valid');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role }),
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim undangan');
      }

      const data = await response.json();

      // Add new invitation to the list
      setInvitedMembers([
        {
          id: Date.now().toString(),
          email,
          role,
          status: 'pending',
          invitedAt: new Date().toISOString(),
        },
        ...invitedMembers,
      ]);

      setSuccess(`Undangan berhasil dikirim ke ${email}`);
      setEmail('');
    } catch (err) {
      setError('Terjadi kesalahan saat mengirim undangan');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelInvite = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/invitations/${id}`, {
        method: 'DELETE',
      });

      setInvitedMembers(invitedMembers.filter((member) => member.id !== id));
      setSuccess('Undangan berhasil dibatalkan');
    } catch (err) {
      setError('Gagal membatalkan undangan');
      console.error(err);
    }
  };

  const getStatusBadge = (status: InvitedMember['status']) => {
    const statusConfig = {
      pending: {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        label: 'Pending',
      },
      accepted: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        label: 'Diterima',
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        label: 'Ditolak',
      },
    };

    const config = statusConfig[status];
    return (
      <span className={`px-3 py-1 ${config.bg} ${config.text} rounded-full text-xs font-bold uppercase`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Invite Form Card */}
        <div className="bg-white rounded-xl p-6 border-2 border-zinc-200 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Undang Anggota Baru</h2>
              <p className="text-sm text-zinc-600">Kirim undangan via email</p>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-zinc-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                className="w-full px-4 py-3 border-2 border-zinc-200 rounded-lg focus:border-purple-500 focus:outline-none transition bg-white text-zinc-900"
                required
              />
            </div>

            {/* Role Select */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-zinc-900 mb-2">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'staff')}
                className="w-full px-4 py-3 border-2 border-zinc-200 rounded-lg focus:border-purple-500 focus:outline-none transition bg-white text-zinc-900"
              >
                <option value="admin">Admin - Full access</option>
                <option value="staff">Staff - Limited access</option>
              </select>
              <p className="mt-2 text-xs text-zinc-500">
                {role === 'admin'
                  ? 'Admin dapat mengelola semua aspek bisnis termasuk booking, settings, dan member lainnya.'
                  : 'Staff hanya dapat mengelola booking dan melihat dashboard.'}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengirim...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                  Kirim Undangan
                </>
              )}
            </button>
          </form>
        </div>

        {/* Invited Members List */}
        <div className="bg-white rounded-xl p-6 border-2 border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Anggota yang Diundang</h2>
                <p className="text-sm text-zinc-600">{invitedMembers.length} total undangan</p>
              </div>
            </div>
          </div>

          {invitedMembers.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <p className="text-zinc-500 text-sm">Belum ada anggota yang diundang</p>
            </div>
          ) : (
            <div className="space-y-3">
              {invitedMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border-2 border-zinc-100 rounded-lg hover:border-purple-200 transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {member.email.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div>
                      <div className="font-semibold text-zinc-900">{member.email}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-500">
                          {new Date(member.invitedAt).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="text-zinc-300">•</span>
                        <span className="text-xs font-semibold text-purple-600 capitalize">
                          {member.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-3">
                    {getStatusBadge(member.status)}

                    {member.status === 'pending' && (
                      <button
                        onClick={() => handleCancelInvite(member.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Batalkan undangan"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="text-sm text-blue-700">
              <p className="font-semibold mb-1">Cara kerja undangan:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Anggota akan menerima email undangan dengan link aktivasi</li>
                <li>Link undangan berlaku selama 7 hari</li>
                <li>Setelah menerima undangan, mereka dapat login dan mengelola bisnis sesuai role</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
