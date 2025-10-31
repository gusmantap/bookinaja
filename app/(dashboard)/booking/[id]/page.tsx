'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Booking = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  service: string;
  price: number;
  duration: string;
  date: string;
  time: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
};

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [businessName] = useState('Demo Business'); // TODO: Get from context/API
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch booking from API
    // For now, use dummy data
    const dummyBooking: Booking = {
      id,
      customerName: 'John Doe',
      customerPhone: '08123456789',
      customerEmail: 'john@example.com',
      service: 'Haircut Classic',
      price: 50000,
      duration: '30 menit',
      date: '2025-11-15',
      time: '14:00',
      notes: 'Mohon dipotong pendek',
      status: 'pending',
      createdAt: '2025-10-30T10:00:00',
    };

    setBooking(dummyBooking);
    setIsLoading(false);
  }, [id]);

  const updateStatus = async (newStatus: Booking['status']) => {
    if (!booking) return;

    // TODO: Call API to update status
    setBooking({ ...booking, status: newStatus });
  };

  const getStatusBadgeClass = (status: Booking['status']) => {
    const classes = {
      pending: 'bg-amber-100 text-amber-700',
      confirmed: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return classes[status];
  };

  if (isLoading || !booking) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back & Title */}
            <div className="flex items-center gap-4">
              <Link href="/booking" className="p-2 hover:bg-zinc-100 rounded-lg transition">
                <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-zinc-900">Detail Booking #{booking.id}</h1>
                <p className="text-xs text-zinc-500">{businessName}</p>
              </div>
            </div>

            {/* Status Badge */}
            <div>
              <span className={`px-3 py-1.5 ${getStatusBadgeClass(booking.status)} rounded-lg text-xs font-bold uppercase`}>
                {booking.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Booking Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info Card */}
            <div className="bg-white rounded-xl border-2 border-zinc-200 p-6">
              <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Informasi Pelanggan
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    {booking.customerName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-zinc-900 text-lg">{booking.customerName}</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{booking.customerPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{booking.customerEmail}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-4 border-t border-zinc-200">
                  <a
                    href={`https://wa.me/${booking.customerPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition text-sm font-semibold"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Chat WhatsApp
                  </a>
                  <a
                    href={`tel:${booking.customerPhone}`}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition text-sm font-semibold"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="hidden sm:inline">Telepon</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Booking Details Card */}
            <div className="bg-white rounded-xl border-2 border-zinc-200 p-6">
              <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Detail Booking
              </h2>

              <div className="space-y-4">
                {/* Service */}
                <div className="flex items-start justify-between py-3 border-b border-zinc-200">
                  <div>
                    <p className="text-sm text-zinc-600 mb-1">Layanan</p>
                    <p className="font-semibold text-zinc-900">{booking.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      Rp {booking.price.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs text-zinc-500">{booking.duration}</p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-600">Tanggal</p>
                      <p className="font-semibold text-zinc-900">
                        {new Date(booking.date).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-600">Waktu</p>
                      <p className="font-semibold text-zinc-900">{booking.time} WIB</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm font-semibold text-amber-900 mb-1">Catatan:</p>
                    <p className="text-sm text-amber-800">{booking.notes}</p>
                  </div>
                )}

                {/* Booking Time */}
                <div className="pt-3 border-t border-zinc-200">
                  <p className="text-xs text-zinc-500">
                    Dibuat pada {new Date(booking.createdAt).toLocaleString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Update Status Card */}
            <div className="bg-white rounded-xl border-2 border-zinc-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-zinc-900 mb-4">Ubah Status</h2>

              <div className="space-y-3">
                {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => {
                  const statusConfig = {
                    pending: { label: 'Pending', desc: 'Menunggu konfirmasi', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                    confirmed: { label: 'Confirmed', desc: 'Booking dikonfirmasi', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                    completed: { label: 'Completed', desc: 'Layanan selesai', icon: 'M5 13l4 4L19 7' },
                    cancelled: { label: 'Cancelled', desc: 'Booking dibatalkan', icon: 'M6 18L18 6M6 6l12 12' },
                  };

                  const config = statusConfig[status];
                  const isActive = booking.status === status;

                  return (
                    <button
                      key={status}
                      onClick={() => updateStatus(status)}
                      className={`w-full p-4 border-2 rounded-xl transition-all text-left ${
                        isActive
                          ? `border-${status === 'pending' ? 'amber' : status === 'confirmed' ? 'green' : status === 'completed' ? 'blue' : 'red'}-500 bg-${status === 'pending' ? 'amber' : status === 'confirmed' ? 'green' : status === 'completed' ? 'blue' : 'red'}-50`
                          : 'border-zinc-200 hover:border-blue-300 hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          status === 'pending' ? 'bg-amber-100' :
                          status === 'confirmed' ? 'bg-green-100' :
                          status === 'completed' ? 'bg-blue-100' : 'bg-red-100'
                        }`}>
                          <svg className={`w-5 h-5 ${
                            status === 'pending' ? 'text-amber-600' :
                            status === 'confirmed' ? 'text-green-600' :
                            status === 'completed' ? 'text-blue-600' : 'text-red-600'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-zinc-900 flex items-center gap-2">
                            {config.label}
                            {isActive && (
                              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="text-xs text-zinc-500">{config.desc}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
