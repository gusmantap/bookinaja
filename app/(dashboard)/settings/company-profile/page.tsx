'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Dummy data - akan diganti dengan data dari session/API
  const [formData, setFormData] = useState({
    businessName: 'Komet Barbershop',
    slug: 'komet',
    ownerName: 'John Doe',
    email: 'john@komet.com',
    phone: '081234567890',
    address: 'Jl. Raya No. 123, Jakarta',
    description: 'Barbershop terbaik di Jakarta dengan layanan premium dan harga terjangkau.',
    website: 'https://kometbarbershop.com',
    instagram: '@kometbarbershop',
    whatsapp: '6281234567890',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan perubahan');
      }

      setSuccess('Profil berhasil diperbarui!');
    } catch (err) {
      setError('Terjadi kesalahan saat menyimpan perubahan');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Information Card */}
          <div className="bg-white rounded-xl p-6 border-2 border-zinc-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Informasi Bisnis</h2>
                <p className="text-sm text-zinc-600">Data utama bisnis Anda</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Business Name */}
              <div>
                <label htmlFor="businessName" className="block text-sm font-semibold text-zinc-900 mb-2">
                  Nama Bisnis
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-zinc-200 rounded-lg focus:border-blue-500 focus:outline-none transition bg-white text-zinc-900"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label htmlFor="slug" className="block text-sm font-semibold text-zinc-900 mb-2">
                  URL Slug
                </label>
                <div className="flex items-stretch gap-0">
                  <div className="flex items-center justify-center px-4 bg-zinc-100 border-2 border-r-0 border-zinc-200 rounded-l-lg whitespace-nowrap text-sm">
                    <span className="text-zinc-700 font-semibold">/</span>
                  </div>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={(e) => {
                      const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setFormData({ ...formData, slug: value });
                    }}
                    className="flex-1 px-4 py-3 border-2 border-zinc-200 rounded-r-lg focus:border-blue-500 focus:outline-none transition bg-white text-zinc-900"
                    placeholder="nama-bisnis"
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  URL publik: <a href={`${process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000'}/${formData.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000'}/{formData.slug}</a>
                </p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-zinc-900 mb-2">
                  Deskripsi Bisnis
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-zinc-200 rounded-lg focus:border-blue-500 focus:outline-none transition resize-none bg-white text-zinc-900"
                  placeholder="Ceritakan tentang bisnis Anda..."
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-zinc-900 mb-2">
                  Alamat
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-zinc-200 rounded-lg focus:border-blue-500 focus:outline-none transition resize-none bg-white text-zinc-900"
                  placeholder="Alamat lengkap bisnis Anda"
                />
              </div>
            </div>
          </div>

          {/* Owner Information Card */}
          <div className="bg-white rounded-xl p-6 border-2 border-zinc-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Informasi Owner</h2>
                <p className="text-sm text-zinc-600">Data kontak pemilik bisnis</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Owner Name */}
              <div>
                <label htmlFor="ownerName" className="block text-sm font-semibold text-zinc-900 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-zinc-200 rounded-lg focus:border-purple-500 focus:outline-none transition bg-white text-zinc-900"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-zinc-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-zinc-200 rounded-lg focus:border-purple-500 focus:outline-none transition bg-white text-zinc-900"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-zinc-900 mb-2">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-zinc-200 rounded-lg focus:border-purple-500 focus:outline-none transition bg-white text-zinc-900"
                  placeholder="081234567890"
                />
              </div>
            </div>
          </div>

          {/* Social Media Card */}
          <div className="bg-white rounded-xl p-6 border-2 border-zinc-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Media Sosial & Website</h2>
                <p className="text-sm text-zinc-600">Koneksi dengan pelanggan</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Website URL */}
              <div>
                <label htmlFor="website" className="block text-sm font-semibold text-zinc-900 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-zinc-200 rounded-lg focus:border-pink-500 focus:outline-none transition bg-white text-zinc-900"
                  placeholder="https://example.com"
                />
                <p className="mt-2 text-xs text-zinc-500">URL website bisnis Anda (opsional)</p>
              </div>
              {/* Instagram */}
              <div>
                <label htmlFor="instagram" className="block text-sm font-semibold text-zinc-900 mb-2">
                  Instagram
                </label>
                <div className="flex items-stretch gap-0">
                  <div className="flex items-center justify-center px-4 bg-zinc-100 border-2 border-r-0 border-zinc-200 rounded-l-lg">
                    <span className="text-zinc-700 font-semibold">@</span>
                  </div>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={formData.instagram.replace('@', '')}
                    onChange={(e) => setFormData({ ...formData, instagram: `@${e.target.value.replace('@', '')}` })}
                    className="flex-1 px-4 py-3 border-2 border-zinc-200 rounded-r-lg focus:border-pink-500 focus:outline-none transition bg-white text-zinc-900"
                    placeholder="kometbarbershop"
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-semibold text-zinc-900 mb-2">
                  WhatsApp Business
                </label>
                <div className="flex items-stretch gap-0">
                  <div className="flex items-center justify-center px-4 bg-zinc-100 border-2 border-r-0 border-zinc-200 rounded-l-lg">
                    <span className="text-zinc-700 font-semibold">+62</span>
                  </div>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp.replace('62', '')}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ''); // Only numbers
                      setFormData({ ...formData, whatsapp: `62${value}` });
                    }}
                    className="flex-1 px-4 py-3 border-2 border-zinc-200 rounded-r-lg focus:border-pink-500 focus:outline-none transition bg-white text-zinc-900"
                    placeholder="81234567890"
                  />
                </div>
                <p className="mt-2 text-xs text-zinc-500">Masukkan nomor tanpa 0 di awal (contoh: 81234567890)</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 px-6 border-2 border-zinc-300 text-zinc-700 font-semibold rounded-lg hover:bg-zinc-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
