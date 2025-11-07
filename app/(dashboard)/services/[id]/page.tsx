import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { createClient } from '@/lib/supabase/server';

type ServiceDetail = {
  id: string;
  name: string;
  duration: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  business?: {
    name?: string;
  } | null;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatDateTime = (value?: string | null) => {
  if (!value) return '-';
  try {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
};

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="bg-zinc-50 min-h-screen flex items-center justify-center">
        <p className="text-zinc-600">Tidak ada akses</p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('services')
    .select(`
      id,
      name,
      duration,
      price,
      isActive,
      createdAt,
      updatedAt,
      business:businesses!inner(
        name,
        business_members!inner(userId, status)
      )
    `)
    .eq('id', id)
    .eq('business.business_members.userId', session.user.id)
    .eq('business.business_members.status', 'active')
    .single<ServiceDetail>();

  if (error || !data) {
    notFound();
  }

  const businessName = data.business?.name ?? 'Bisnis Anda';

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <Link
              href="/services"
              className="p-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 transition"
              aria-label="Kembali ke daftar layanan"
            >
              <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </Link>
            <div>
              <p className="text-sm text-zinc-500 uppercase tracking-wide">Detail Layanan</p>
              <h1 className="text-2xl font-bold text-zinc-900 mt-1">{data.name}</h1>
              <p className="text-sm text-zinc-600 mt-1">{businessName}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-semibold ${
              data.isActive ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'
            }`}
          >
            {data.isActive ? 'AKTIF' : 'NONAKTIF'}
          </span>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border-2 border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4">Informasi Utama</h2>
              <dl className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <dt className="text-sm text-zinc-500">Nama Layanan</dt>
                  <dd className="text-base font-semibold text-zinc-900">{data.name}</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <dt className="text-sm text-zinc-500">Durasi</dt>
                  <dd className="text-base font-semibold text-zinc-900">{data.duration}</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <dt className="text-sm text-zinc-500">Harga</dt>
                  <dd className="text-base font-semibold text-purple-600">{formatCurrency(data.price)}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white rounded-2xl border-2 border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4">Aktivitas</h2>
              <dl className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <dt className="text-sm text-zinc-500">Dibuat pada</dt>
                  <dd className="text-base font-semibold text-zinc-900">{formatDateTime(data.createdAt)}</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <dt className="text-sm text-zinc-500">Terakhir diperbarui</dt>
                  <dd className="text-base font-semibold text-zinc-900">{formatDateTime(data.updatedAt)}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border-2 border-zinc-200 p-6">
              <h3 className="text-base font-semibold text-zinc-900 mb-4">Ringkasan</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-zinc-600">
                  <span>Status</span>
                  <span className={`font-semibold ${data.isActive ? 'text-green-600' : 'text-zinc-600'}`}>
                    {data.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-zinc-600">
                  <span>Durasi</span>
                  <span className="font-semibold text-zinc-900">{data.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-zinc-600">
                  <span>Harga</span>
                  <span className="font-semibold text-purple-600">{formatCurrency(data.price)}</span>
                </div>
              </div>
              <Link
                href="/services"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-zinc-200 text-zinc-700 font-semibold hover:bg-zinc-50 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path>
                </svg>
                Kelola di Halaman Layanan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
