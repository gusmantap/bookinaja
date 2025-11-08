'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProblemSection1 from '@/components/landing/ProblemSection1';
import ProblemSection2 from '@/components/landing/ProblemSection2';
import ProblemSection3 from '@/components/landing/ProblemSection3';
import ProblemSection4 from '@/components/landing/ProblemSection4';

export default function LandingPage() {
  const router = useRouter();
  const [subdomain, setSubdomain] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const reserved = ['admin', 'api', 'www', 'mail', 'ftp', 'blog', 'shop', 'store', 'dashboard', 'app'];

  const checkSubdomain = async (value: string) => {
    if (!value) {
      setError('');
      setSuccess('');
      return;
    }

    setIsChecking(true);
    setError('');
    setSuccess('');

    await new Promise(resolve => setTimeout(resolve, 500));

    if (value.length < 3) {
      setError('Minimal 3 karakter');
      setIsChecking(false);
      return;
    }

    if (value.startsWith('-') || value.endsWith('-')) {
      setError('Tidak boleh diawali atau diakhiri dengan tanda "-"');
      setIsChecking(false);
      return;
    }

    if (reserved.includes(value.toLowerCase())) {
      setError('Subdomain ini sudah direservasi sistem');
      setIsChecking(false);
      return;
    }

    // TODO: Check availability with API
    const takenSubdomains = ['komet', 'jenanail', 'memorias'];
    if (takenSubdomains.includes(value.toLowerCase())) {
      setError('Subdomain sudah dipakai, coba yang lain');
      setIsChecking(false);
      return;
    }

    setSuccess('✓ Subdomain tersedia!');
    setIsChecking(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(value);
    checkSubdomain(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subdomain || error || isChecking) return;

    sessionStorage.setItem('onboarding_subdomain', subdomain);
    router.push('/onboarding/step1');
  };

  return (
    <div className="bg-white antialiased">
      {/* Navigation */}
      <nav className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-zinc-900">Bookinaja</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 transition">
                Masuk
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Label Badge */}
              <div className="inline-flex">
                <div className="px-4 py-1.5 rounded-full border border-zinc-200 bg-zinc-50">
                  <span className="text-sm font-medium text-zinc-900">Solusi untuk Pemilik Bisnis</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                <span className="text-zinc-900">Kelola Jadwal</span><br />
                <span className="text-blue-600">Tanpa Kesalahan</span><br />
                <span className="text-zinc-900">Tanpa <span className="text-blue-600">Ribet</span></span>
              </h1>

              {/* Subheadline */}
              <p className="text-2xl font-semibold text-zinc-700 max-w-xl">
                Semua pesanan tersimpan otomatis, cegah jadwal bentrok, dan kirim pengingat lewat WhatsApp
              </p>

              {/* Description */}
              <p className="text-lg text-zinc-600 max-w-xl leading-relaxed">
                Sistem yang membuat bisnis Anda jalan lancar. Staf tidak bingung, pelanggan tidak lupa, dan Anda tidak pusing.
              </p>

              {/* Subdomain Claim Form */}
              <div className="pt-4">
                <form onSubmit={handleSubmit} className="max-w-2xl">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <div className="flex items-center bg-white border-2 border-zinc-300 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all shadow-sm">
                        <div className="pl-4 pr-2 py-4 text-zinc-500 font-medium text-sm sm:text-base whitespace-nowrap">
                          reservasiku.com/
                        </div>
                        <input
                          type="text"
                          value={subdomain}
                          onChange={handleInput}
                          required
                          maxLength={30}
                          className="flex-1 py-4 pr-12 outline-none text-sm sm:text-base font-semibold text-zinc-900 placeholder-zinc-400"
                          placeholder="namabisnis"
                          autoComplete="off"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {isChecking && (
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          )}
                          {!isChecking && success && (
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                          {!isChecking && error && (
                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
                      {success && <p className="text-xs text-green-600 mt-1.5">{success}</p>}
                    </div>
                    <button
                      type="submit"
                      disabled={!subdomain || !!error || isChecking}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm sm:text-base font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      Mulai Sekarang →
                    </button>
                  </div>
                </form>
              </div>

              {/* Trust Badge */}
              <p className="text-sm text-zinc-500">
                Gratis 30 hari pertama • Tidak perlu kartu kredit • Bisa batal kapan saja
              </p>
            </div>

            {/* Right Illustration */}
            <div className="relative lg:block hidden">
              <div className="border border-zinc-200 rounded-xl p-8 shadow-sm bg-white">
                <div className="space-y-6">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                    <h3 className="font-semibold text-lg text-zinc-900">Jadwal Hari Ini</h3>
                    <div className="px-3 py-1 rounded-md bg-blue-50 border border-blue-200">
                      <span className="text-sm font-medium text-blue-700">3 Pesanan</span>
                    </div>
                  </div>

                  {/* Schedule Items */}
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg border border-zinc-200 hover:border-blue-300 hover:bg-blue-50/50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-semibold text-blue-700">S</span>
                            </div>
                            <div>
                              <p className="font-semibold text-zinc-900">Ibu Siti</p>
                              <p className="text-sm text-zinc-500">09:00 - 10:00</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 font-medium">Terkonfirmasi</span>
                            <span className="text-zinc-400">• Pengingat terkirim</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-zinc-200 hover:border-purple-300 hover:bg-purple-50/50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="text-sm font-semibold text-purple-700">B</span>
                            </div>
                            <div>
                              <p className="font-semibold text-zinc-900">Pak Budi</p>
                              <p className="text-sm text-zinc-500">13:00 - 14:00</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 font-medium">Terkonfirmasi</span>
                            <span className="text-zinc-400">• Akan diingatkan 1 jam lagi</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-zinc-200 hover:border-pink-300 hover:bg-pink-50/50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                              <span className="text-sm font-semibold text-pink-700">A</span>
                            </div>
                            <div>
                              <p className="font-semibold text-zinc-900">Ibu Ani</p>
                              <p className="text-sm text-zinc-500">15:00 - 16:00</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 font-medium">Menunggu</span>
                            <span className="text-zinc-400">• Baru dipesan</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Bar */}
                  <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-zinc-700">Semua staf dapat melihat ini</span>
                      </div>
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-12 border-y border-zinc-200 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-zinc-900 mb-1">500+</div>
              <p className="text-sm text-zinc-600">Bisnis Bergabung</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-zinc-900 mb-1">15K+</div>
              <p className="text-sm text-zinc-600">Pesanan per Bulan</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-zinc-900 mb-1">98%</div>
              <p className="text-sm text-zinc-600">Tingkat Kepuasan</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-zinc-900 mb-1">4.9</div>
              <p className="text-sm text-zinc-600">Rating Pengguna</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem 1: Informasi Hilang Ganti Jaga */}
      <ProblemSection1 />
      {/* How It Works */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 leading-tight">
              Mulai dalam <span className="text-blue-600">3 Langkah</span> Mudah
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Tidak perlu keahlian khusus. Siap pakai dalam 5 menit.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="p-8 rounded-lg border border-zinc-200 bg-white hover:shadow-md transition">
                <div className="absolute -top-4 left-8">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">1</div>
                </div>
                <div className="mt-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 mb-2">Masuk dengan Google</h3>
                  <p className="text-sm text-zinc-600">
                    Cukup klik satu tombol. Tidak perlu isi formulir panjang atau buat kata sandi baru.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="p-8 rounded-lg border border-zinc-200 bg-white hover:shadow-md transition">
                <div className="absolute -top-4 left-8">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">2</div>
                </div>
                <div className="mt-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 mb-2">Atur Bisnis Anda</h3>
                  <p className="text-sm text-zinc-600">
                    Isi informasi bisnis, layanan, dan jam operasional. Mudah dan cepat.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="p-8 rounded-lg border border-zinc-200 bg-white hover:shadow-md transition">
                <div className="absolute -top-4 left-8">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">3</div>
                </div>
                <div className="mt-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 mb-2">Bagikan Link</h3>
                  <p className="text-sm text-zinc-600">
                    Salin link booking Anda dan bagikan ke pelanggan. Pesanan langsung masuk otomatis.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center justify-center px-8 py-3 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Mulai Gratis Sekarang
            </button>
            <p className="mt-4 text-sm text-zinc-500">
              Rata-rata setup selesai dalam 5 menit
            </p>
          </div>
        </div>
      </section>

      {/* Problem 2: Pelanggan Lupa Datang */}
      <ProblemSection2 />
      {/* Problem 3: Jadwal Bentrok */}
      <ProblemSection3 />
      {/* Problem 4: Staf Lupa Jadwal */}
      <ProblemSection4 />
      {/* Testimonials */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">
              Yang Baru Saja <span className="text-blue-600">Bergabung</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-zinc-200 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700">L</div>
                <div>
                  <p className="font-semibold text-zinc-900">Lisa</p>
                  <p className="text-xs text-zinc-500">2 jam yang lalu</p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 italic mb-3">
                "Baru setup 10 menit, langsung bisa terima pesanan pertama. Gampang banget!"
              </p>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-lg border border-zinc-200 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-semibold text-purple-700">F</div>
                <div>
                  <p className="font-semibold text-zinc-900">Farid</p>
                  <p className="text-xs text-zinc-500">5 jam yang lalu</p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 italic mb-3">
                "Pengingat WhatsApp-nya sangat membantu. Pelanggan jadi jarang lupa datang!"
              </p>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-lg border border-zinc-200 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center font-semibold text-pink-700">M</div>
                <div>
                  <p className="font-semibold text-zinc-900">Maya</p>
                  <p className="text-xs text-zinc-500">1 hari yang lalu</p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 italic mb-3">
                "Staf ganti jaga jadi smooth, tidak ada informasi yang terlewat. Recommended!"
              </p>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 1: Custom Domain */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <div className="inline-flex px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
                <span className="text-sm font-medium text-blue-700">Fitur Premium</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 leading-tight">
                Link Booking dengan <span className="text-blue-600">Domain Sendiri</span>
              </h2>
              <p className="text-lg text-zinc-600 leading-relaxed">
                Gunakan nama bisnis Anda sendiri untuk link booking (misalnya: komet.com atau reservasiku.com/komet). Lebih profesional dan mudah diingat pelanggan!
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-1">Terlihat Lebih Profesional</h4>
                    <p className="text-sm text-zinc-600">Link dengan nama bisnis sendiri meningkatkan trust dan kredibilitas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-1">Mudah Diingat Pelanggan</h4>
                    <p className="text-sm text-zinc-600">Pelanggan cukup ingat nama bisnis Anda untuk booking lagi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-1">Setup Sekali Klik</h4>
                    <p className="text-sm text-zinc-600">Atur custom domain Anda dengan mudah dari dashboard</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Visual */}
            <div className="relative">
              <div className="border border-zinc-200 rounded-2xl p-6 shadow-lg bg-white">
                {/* Browser Mockup */}
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 mb-6">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 mx-4 px-4 py-1.5 rounded-lg bg-zinc-100 text-xs font-medium text-zinc-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    <span>kometbarbershop.com</span>
                  </div>
                </div>

                {/* Website Preview */}
                <div className="space-y-4">
                  <div className="text-center py-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center">
                      <span className="text-2xl font-black text-white">K</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Komet Barbershop</h3>
                    <p className="text-sm text-white/80">Jl. Sudirman No. 45, Jakarta</p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900">Booking Sekarang</h4>
                        <p className="text-xs text-zinc-600">Pilih tanggal & waktu Anda</p>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg">
                      Reservasi Sekarang
                    </button>
                  </div>

                  {/* URL Comparison */}
                  <div className="pt-4 border-t border-zinc-200">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="text-center">
                        <div className="p-2 bg-red-50 border border-red-200 rounded-lg mb-2">
                          <p className="text-red-700 font-mono break-all">reservasiku.com/b/a3x9k2</p>
                        </div>
                        <p className="text-red-600 font-medium">❌ Sulit diingat</p>
                      </div>
                      <div className="text-center">
                        <div className="p-2 bg-green-50 border border-green-200 rounded-lg mb-2">
                          <p className="text-green-700 font-mono">kometbarbershop.com</p>
                        </div>
                        <p className="text-green-600 font-medium">✓ Mudah diingat!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: Calendar Management */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Demo Visual */}
            <div className="relative">
              <div className="border border-zinc-200 rounded-2xl p-6 shadow-lg bg-white">
                {/* Calendar View */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-bold text-zinc-900">Kalender Booking</h4>
                    <div className="flex gap-2">
                      <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition">
                        <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                      </button>
                      <div className="px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
                        <span className="text-sm font-semibold text-purple-700">November 2024</span>
                      </div>
                      <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition">
                        <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Mini Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
                      <div key={day} className="text-center text-xs font-semibold text-zinc-500 py-2">{day}</div>
                    ))}

                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => (
                      <div key={i} className={`aspect-square flex items-center justify-center text-sm rounded-lg hover:bg-zinc-100 cursor-pointer ${[5, 12].includes(i) ? 'bg-purple-100 border-2 border-purple-400 font-bold text-purple-700' : (i === 8 ? 'bg-red-100 text-red-700 font-semibold' : 'text-zinc-700')}`}>
                        {i}
                      </div>
                    ))}
                  </div>

                  {/* Booking List for Selected Date */}
                  <div className="pt-4 border-t border-zinc-200">
                    <p className="text-sm font-semibold text-zinc-700 mb-3">Booking 5 November:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                        <div className="w-1.5 h-12 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-zinc-900">09:00 - Haircut Classic</p>
                          <p className="text-xs text-zinc-600">Budi Santoso • Rp 50.000</p>
                        </div>
                        <div className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">Lunas</div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                        <div className="w-1.5 h-12 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-zinc-900">11:00 - Manicure</p>
                          <p className="text-xs text-zinc-600">Siti Rahayu • Rp 60.000</p>
                        </div>
                        <div className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-medium">Pending</div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <div className="w-1.5 h-12 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-zinc-900">14:00 - Premium Cut</p>
                          <p className="text-xs text-zinc-600">Andi Wijaya • Rp 100.000</p>
                        </div>
                        <div className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">Lunas</div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="pt-4 border-t border-zinc-200">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                        <p className="text-2xl font-bold text-purple-600">3</p>
                        <p className="text-xs text-zinc-600">Booking</p>
                      </div>
                      <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                        <p className="text-2xl font-bold text-green-600">210k</p>
                        <p className="text-xs text-zinc-600">Revenue</p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="text-2xl font-bold text-blue-600">5</p>
                        <p className="text-xs text-zinc-600">Slot Kosong</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-6">
              <div className="inline-flex px-3 py-1 rounded-full bg-purple-50 border border-purple-200">
                <span className="text-sm font-medium text-purple-700">Fitur Utama</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 leading-tight">
                Kelola Jadwal dalam <span className="text-purple-600">Satu Kalender</span>
              </h2>
              <p className="text-lg text-zinc-600 leading-relaxed">
                Lihat semua booking dalam kalender visual yang jelas. Tidak perlu buka-tutup notes atau spreadsheet lagi. Semua jadwal tersimpan rapi dan mudah dikelola!
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-1">Lihat Sekilas Tanggal Penuh/Kosong</h4>
                    <p className="text-sm text-zinc-600">Kalender highlight tanggal yang sudah ada booking, tanggal merah artinya penuh</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-1">Detail Booking Per Tanggal</h4>
                    <p className="text-sm text-zinc-600">Klik tanggal untuk lihat semua booking, lengkap dengan nama, layanan, dan status pembayaran</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-1">Statistik Real-time</h4>
                    <p className="text-sm text-zinc-600">Lihat jumlah booking, revenue hari ini, dan slot kosong tersisa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3: Email Reminder System */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <div className="inline-flex px-3 py-1 rounded-full bg-green-50 border border-green-200">
                <span className="text-sm font-medium text-green-700">Fitur Otomatis</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 leading-tight">
                Pengingat <span className="text-green-600">Email</span> Otomatis
              </h2>
              <p className="text-lg text-zinc-600 leading-relaxed">
                Pelanggan sering lupa jadwal booking mereka? Sistem kami kirim email pengingat otomatis sebelum waktu booking. Tidak perlu WhatsApp satu-satu lagi!
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-1">Kirim Otomatis 1 Hari Sebelumnya</h4>
                    <p className="text-sm text-zinc-600">Email pengingat terkirim otomatis 24 jam sebelum jadwal booking</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-1">Konfirmasi Booking Langsung</h4>
                    <p className="text-sm text-zinc-600">Begitu pelanggan booking, langsung dapat email konfirmasi dengan detail lengkap</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-1">Hemat Waktu Staf</h4>
                    <p className="text-sm text-zinc-600">Tidak perlu reminder manual lagi, semua otomatis dari sistem</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Visual */}
            <div className="relative">
              <div className="border border-zinc-200 rounded-2xl p-6 shadow-lg bg-gradient-to-br from-white to-zinc-50">
                {/* Email Preview */}
                <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                  {/* Email Header */}
                  <div className="bg-blue-600 px-6 py-4">
                    <h4 className="text-lg font-bold text-white">Bookinaja</h4>
                  </div>

                  {/* Email Body */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                      </div>
                      <div>
                        <h5 className="font-bold text-zinc-900">Pengingat Booking Besok</h5>
                        <p className="text-xs text-zinc-500">Jangan sampai terlewat!</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <p className="text-sm text-zinc-700 mb-3">Halo <strong>Budi Santoso</strong>,</p>
                      <p className="text-sm text-zinc-700 mb-3">Ini pengingat untuk booking Anda besok:</p>

                      <div className="bg-white rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-600">Layanan:</span>
                          <span className="font-semibold text-zinc-900">Haircut Classic</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-600">Tanggal:</span>
                          <span className="font-semibold text-zinc-900">5 November 2024</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-600">Waktu:</span>
                          <span className="font-semibold text-zinc-900">09:00 WIB</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-600">Lokasi:</span>
                          <span className="font-semibold text-zinc-900">Komet Barbershop</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="bg-zinc-900 text-white text-center py-3 rounded-lg font-semibold text-sm">
                        Lihat Detail Booking
                      </div>
                    </div>

                    <p className="text-xs text-zinc-500 text-center pt-2">
                      Butuh reschedule? Klik link di atas untuk mengubah jadwal
                    </p>
                  </div>
                </div>

                {/* Sent Badge */}
                <div className="absolute -top-3 -right-3 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-semibold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Terkirim Otomatis
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 4: Simple CRM Customer Listing */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Demo Visual */}
            <div className="order-2 lg:order-1">
              <div className="border border-zinc-200 rounded-2xl p-6 shadow-lg bg-white">
                {/* CRM Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200">
                  <div>
                    <h4 className="text-lg font-bold text-zinc-900">Daftar Pesanan</h4>
                    <p className="text-sm text-zinc-500">Kelola semua customer Anda</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-purple-100 border border-purple-200">
                    <span className="text-sm font-semibold text-purple-700">8 Pesanan</span>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-4">
                  <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">Semua</button>
                  <button className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-700 text-sm font-medium hover:bg-zinc-200 transition">Hari Ini</button>
                  <button className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-700 text-sm font-medium hover:bg-zinc-200 transition">Besok</button>
                </div>

                {/* Customer List */}
                <div className="space-y-3">
                  {/* Customer 1 */}
                  <div className="group p-4 rounded-xl border border-zinc-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-700">BS</span>
                        </div>
                        <div>
                          <h5 className="font-semibold text-zinc-900">Budi Santoso</h5>
                          <p className="text-xs text-zinc-500">08123456789</p>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-green-500 text-white p-2 rounded-lg">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-600">Haircut Classic</span>
                      <span className="font-semibold text-zinc-900">09:00 • 5 Nov</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-zinc-500">Rp 50.000</span>
                      <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 font-medium">Confirmed</span>
                    </div>
                  </div>

                  {/* Customer 2 */}
                  <div className="group p-4 rounded-xl border border-zinc-200 hover:border-purple-300 hover:bg-purple-50/30 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-purple-700">SR</span>
                        </div>
                        <div>
                          <h5 className="font-semibold text-zinc-900">Siti Rahayu</h5>
                          <p className="text-xs text-zinc-500">08198765432</p>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-green-500 text-white p-2 rounded-lg">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-600">Gel Polish</span>
                      <span className="font-semibold text-zinc-900">11:00 • 5 Nov</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-zinc-500">Rp 120.000</span>
                      <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 font-medium">Pending</span>
                    </div>
                  </div>

                  {/* Customer 3 */}
                  <div className="group p-4 rounded-xl border border-zinc-200 hover:border-pink-300 hover:bg-pink-50/30 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-pink-700">AW</span>
                        </div>
                        <div>
                          <h5 className="font-semibold text-zinc-900">Andi Wijaya</h5>
                          <p className="text-xs text-zinc-500">08156781234</p>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-green-500 text-white p-2 rounded-lg">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-600">Premium Haircut</span>
                      <span className="font-semibold text-zinc-900">14:00 • 6 Nov</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-zinc-500">Rp 100.000</span>
                      <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 font-medium">Confirmed</span>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Hint */}
                <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <p className="text-xs text-green-700"><strong>Tip:</strong> Hover & klik icon WhatsApp untuk chat langsung!</p>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex px-3 py-1 rounded-full bg-pink-50 border border-pink-200">
                <span className="text-sm font-medium text-pink-700">CRM Sederhana</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 leading-tight">
                Kelola <span className="text-purple-600">Pelanggan</span> Jadi <span className="text-pink-600">Mudah</span>
              </h2>
              <p className="text-lg text-zinc-600 leading-relaxed">
                Lihat daftar semua pelanggan yang booking dalam satu tempat. Klik satu tombol langsung chat WhatsApp dengan nomor mereka. Tidak perlu catat manual atau buka kontak satu-satu!
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-1">Semua Data Pelanggan Terpusat</h4>
                    <p className="text-sm text-zinc-600">Nama, nomor HP, layanan yang dipesan, semua tersimpan rapi dan mudah dicari</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-1">WhatsApp Direct Link</h4>
                    <p className="text-sm text-zinc-600">Klik tombol WhatsApp langsung diarahkan ke chat dengan pelanggan (wa.me/nomor)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-1">Filter & Status Booking</h4>
                    <p className="text-sm text-zinc-600">Filter booking hari ini, besok, atau semua. Lihat status confirmed/pending dengan jelas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 leading-tight">
              Gratis <span className="text-blue-600">30 Hari</span> Pertama
            </h2>
            <p className="text-xl text-zinc-600">Tidak perlu kartu kredit. Bisa batal kapan saja.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-lg border border-zinc-200 bg-white">
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">Pemula</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-zinc-900">Rp 0</span>
                <span className="text-zinc-600">/30 hari</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center text-zinc-700">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  50 pesanan/bulan
                </li>
                <li className="flex items-center text-zinc-700">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  1 jenis bisnis
                </li>
                <li className="flex items-center text-zinc-700">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Pengingat WhatsApp
                </li>
              </ul>
            </div>

            {/* Professional */}
            <div className="relative p-8 rounded-lg border-2 border-blue-600 bg-white shadow-lg">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="px-4 py-1 rounded-full bg-blue-600 text-white text-sm font-semibold">Paling Populer</span>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">Profesional</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-blue-600">Rp 299K</span>
                <span className="text-zinc-600">/bulan</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center text-zinc-700">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Pesanan tak terbatas
                </li>
                <li className="flex items-center text-zinc-700">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  3 jenis bisnis
                </li>
                <li className="flex items-center text-zinc-700">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Pengingat WhatsApp
                </li>
                <li className="flex items-center text-zinc-700">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Cegah jadwal bentrok
                </li>
              </ul>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-lg border border-zinc-200 bg-white">
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">Perusahaan</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-zinc-900">Hubungi</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center text-zinc-700">
                  <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Semua tak terbatas
                </li>
                <li className="flex items-center text-zinc-700">
                  <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Merek sendiri
                </li>
                <li className="flex items-center text-zinc-700">
                  <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Sesuaikan sendiri
                </li>
                <li className="flex items-center text-zinc-700">
                  <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Tim khusus
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 leading-tight">
              Pertanyaan yang Sering <span className="text-blue-600">Ditanyakan</span>
            </h2>
            <p className="text-xl text-zinc-600">
              Semua yang perlu Anda tahu sebelum memulai
            </p>
          </div>

          <div className="space-y-4">
            <details className="group p-6 rounded-lg border border-zinc-200 bg-white hover:border-blue-300 transition">
              <summary className="flex justify-between items-center cursor-pointer font-semibold text-zinc-900 list-none">
                <span>Apakah saya perlu kemampuan teknis untuk menggunakan ini?</span>
                <svg className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </summary>
              <div className="mt-4 text-zinc-600 text-sm leading-relaxed">
                Tidak sama sekali. Kalau Anda bisa pakai WhatsApp, pasti bisa pakai Bookinaja. Tidak ada kode, tidak ada pengaturan rumit.
              </div>
            </details>

            <details className="group p-6 rounded-lg border border-zinc-200 bg-white hover:border-blue-300 transition">
              <summary className="flex justify-between items-center cursor-pointer font-semibold text-zinc-900 list-none">
                <span>Bagaimana cara kerja pengingat WhatsApp?</span>
                <svg className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </summary>
              <div className="mt-4 text-zinc-600 text-sm leading-relaxed">
                Sistem akan mengirim pesan WhatsApp otomatis ke pelanggan beberapa jam sebelum jadwal mereka. Anda bisa atur kapan pengingat dikirim (misalnya 2 jam atau 1 hari sebelumnya).
              </div>
            </details>

            <details className="group p-6 rounded-lg border border-zinc-200 bg-white hover:border-blue-300 transition">
              <summary className="flex justify-between items-center cursor-pointer font-semibold text-zinc-900 list-none">
                <span>Bagaimana sistem mencegah jadwal bentrok?</span>
                <svg className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </summary>
              <div className="mt-4 text-zinc-600 text-sm leading-relaxed">
                Ketika pelanggan memilih jadwal, sistem langsung cek apakah jam tersebut masih kosong. Kalau sudah ada yang pesan, jam itu tidak bisa dipilih lagi. Jadi tidak mungkin ada 2 orang pesan jam yang sama.
              </div>
            </details>

            <details className="group p-6 rounded-lg border border-zinc-200 bg-white hover:border-blue-300 transition">
              <summary className="flex justify-between items-center cursor-pointer font-semibold text-zinc-900 list-none">
                <span>Berapa lama waktu yang dibutuhkan untuk setup?</span>
                <svg className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </summary>
              <div className="mt-4 text-zinc-600 text-sm leading-relaxed">
                Rata-rata pengguna baru selesai setup dalam 5 menit. Anda cukup masuk dengan akun Google, pilih jenis bisnis, sesuaikan formulir, lalu langsung bisa terima pesanan.
              </div>
            </details>

            <details className="group p-6 rounded-lg border border-zinc-200 bg-white hover:border-blue-300 transition">
              <summary className="flex justify-between items-center cursor-pointer font-semibold text-zinc-900 list-none">
                <span>Apakah data saya aman?</span>
                <svg className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </summary>
              <div className="mt-4 text-zinc-600 text-sm leading-relaxed">
                Sangat aman. Data Anda tersimpan dengan enkripsi tingkat bank. Kami tidak pernah membagikan data Anda ke pihak ketiga.
              </div>
            </details>

            <details className="group p-6 rounded-lg border border-zinc-200 bg-white hover:border-blue-300 transition">
              <summary className="flex justify-between items-center cursor-pointer font-semibold text-zinc-900 list-none">
                <span>Apakah saya bisa batal kapan saja?</span>
                <svg className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </summary>
              <div className="mt-4 text-zinc-600 text-sm leading-relaxed">
                Tentu saja. Tidak ada kontrak jangka panjang atau biaya batal. Anda bisa berhenti berlangganan kapan saja dengan sekali klik.
              </div>
            </details>

            <details className="group p-6 rounded-lg border border-zinc-200 bg-white hover:border-blue-300 transition">
              <summary className="flex justify-between items-center cursor-pointer font-semibold text-zinc-900 list-none">
                <span>Apakah staf saya bisa akses juga?</span>
                <svg className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </summary>
              <div className="mt-4 text-zinc-600 text-sm leading-relaxed">
                Ya! Anda bisa mengundang anggota tim tanpa batas. Setiap staf bisa login dan melihat jadwal pesanan secara realtime.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Hentikan <span className="text-blue-400">Kesalahan</span><br />
            Mulai <span className="text-blue-400">Hari Ini</span>
          </h2>

          <p className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto">
            Yang membuat staf Anda ganti jaga jadi mudah dan tidak ada jadwal terlewat
          </p>

          <button
            onClick={() => document.getElementById('claimForm')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center justify-center px-10 py-4 bg-white text-zinc-900 text-lg font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
          >
            Mulai Gratis Sekarang →
          </button>

          <p className="mt-6 text-sm text-zinc-400">
            Gratis 30 hari • Tidak perlu kartu kredit
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-xl font-bold text-zinc-900 mb-4">Bookinaja</h5>
              <p className="text-sm text-zinc-600">Kelola jadwal tanpa kesalahan</p>
            </div>
            <div>
              <h6 className="font-semibold text-zinc-900 mb-4">Produk</h6>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><a href="#" className="hover:text-zinc-900 transition">Fitur</a></li>
                <li><a href="#" className="hover:text-zinc-900 transition">Harga</a></li>
                <li><a href="#" className="hover:text-zinc-900 transition">Contoh</a></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold text-zinc-900 mb-4">Perusahaan</h6>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><a href="#" className="hover:text-zinc-900 transition">Tentang</a></li>
                <li><a href="#" className="hover:text-zinc-900 transition">Blog</a></li>
                <li><a href="#" className="hover:text-zinc-900 transition">Karir</a></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold text-zinc-900 mb-4">Legal</h6>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><a href="#" className="hover:text-zinc-900 transition">Privasi</a></li>
                <li><a href="#" className="hover:text-zinc-900 transition">Ketentuan</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-200 mt-8 pt-8 text-center text-sm text-zinc-600">
            <p>&copy; 2024 Bookinaja. Hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
