'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingStep1() {
  const router = useRouter();
  const [subdomain, setSubdomain] = useState('');
  const [slugError, setSlugError] = useState('');
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    address: '',
    email: '',
    instagram: '',
  });

  useEffect(() => {
    // Load from sessionStorage
    const savedSubdomain = sessionStorage.getItem('onboarding_subdomain');
    const savedStep1 = sessionStorage.getItem('onboarding_step1');

    if (savedSubdomain) setSubdomain(savedSubdomain);
    if (savedStep1) {
      setFormData(JSON.parse(savedStep1));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSlugError('');

    try {
      // Check slug availability
      const response = await fetch('/api/check-slug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: subdomain }),
      });

      const data = await response.json();

      if (!data.available) {
        setSlugError(data.message || 'URL sudah digunakan');
        setIsSubmitting(false);
        return;
      }

      // Save to sessionStorage
      sessionStorage.setItem('onboarding_subdomain', subdomain);
      sessionStorage.setItem('onboarding_step1', JSON.stringify(formData));

      // Navigate to step 2
      router.push('/onboarding/step2');
    } catch (error) {
      console.error('Error checking slug:', error);
      setSlugError('Terjadi kesalahan saat mengecek URL');
      setIsSubmitting(false);
    }
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to lowercase and remove spaces/special chars
    const value = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    setSubdomain(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step 1 of 3</span>
            <span className="text-sm font-medium text-zinc-600">33%</span>
          </div>
          <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all"
              style={{ width: '33%' }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">Informasi Bisnis</h1>
            <p className="text-zinc-600">Ceritakan tentang bisnis Anda kepada pelanggan</p>
            {subdomain && (
              <div className="mt-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-bold">Your URL:</span> reservasiku.com/<span className="font-bold">{subdomain}</span>
                </p>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subdomain/Slug */}
            <div>
              <label htmlFor="subdomain" className="block text-sm font-semibold text-zinc-700 mb-2">
                URL Bisnis Anda <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 text-sm">{process.env.NEXT_PUBLIC_HOST?.replace(/^https?:\/\//, '') || 'localhost:3000'}/</span>
                <input
                  type="text"
                  name="subdomain"
                  id="subdomain"
                  required
                  minLength={3}
                  maxLength={50}
                  value={subdomain}
                  onChange={handleSubdomainChange}
                  className="flex-1 px-4 py-3 border-2 border-zinc-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  placeholder="komet-barbershop"
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Hanya huruf kecil, angka, dan tanda hubung (-). Minimal 3 karakter.
              </p>
              {slugError && (
                <p className="text-sm text-red-600 mt-2 font-medium">
                  ❌ {slugError}
                </p>
              )}
              {subdomain && !slugError && (
                <p className="text-sm text-blue-600 mt-2 font-medium">
                  ✓ Preview: {process.env.NEXT_PUBLIC_HOST?.replace(/^https?:\/\//, '') || 'localhost:3000'}/{subdomain}
                </p>
              )}
            </div>

            {/* Business Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-zinc-700 mb-2">
                Nama Bisnis <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                maxLength={100}
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-zinc-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                placeholder="Contoh: Komet Barbershop"
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-semibold text-zinc-700 mb-2">
                Bio / Deskripsi Bisnis <span className="text-red-500">*</span>
              </label>
              <textarea
                name="bio"
                id="bio"
                required
                rows={4}
                maxLength={500}
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-zinc-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                placeholder="Ceritakan tentang bisnis Anda, layanan yang ditawarkan, dan keunikan yang membedakan..."
              />
              <p className="text-xs text-zinc-500 mt-1">Maksimal 500 karakter</p>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-zinc-700 mb-2">
                Nomor WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                pattern="[0-9]+"
                maxLength={15}
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-zinc-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                placeholder="08123456789"
              />
              <p className="text-xs text-zinc-500 mt-1">Format: 08123456789 (tanpa spasi atau karakter lain)</p>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-zinc-700 mb-2">
                Alamat <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                id="address"
                required
                rows={2}
                maxLength={200}
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-zinc-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                placeholder="Jl. Sudirman No. 45, Jakarta Pusat"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-zinc-700 mb-2">
                Email <span className="text-zinc-400">(Opsional)</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-zinc-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                placeholder="info@bisnis.com"
              />
            </div>

            {/* Instagram */}
            <div>
              <label htmlFor="instagram" className="block text-sm font-semibold text-zinc-700 mb-2">
                Instagram <span className="text-zinc-400">(Opsional)</span>
              </label>
              <input
                type="text"
                name="instagram"
                id="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-zinc-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                placeholder="@namabisnis"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push('/')}
                disabled={isSubmitting}
                className="px-6 py-3 border-2 border-zinc-300 text-zinc-700 font-semibold rounded-xl hover:bg-zinc-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Mengecek URL...' : 'Lanjut ke Step 2 →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
