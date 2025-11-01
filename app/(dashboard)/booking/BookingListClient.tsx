'use client';

import { useState } from 'react';
import Link from 'next/link';

type Booking = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  service: {
    id: string;
    name: string;
  };
  bookingDate: string;
  bookingTime: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment?: {
    id: string;
    method: string;
    status: string;
    proofUrl: string | null;
    amount: number;
  } | null;
  createdAt: string;
};

export default function BookingListClient({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter);

  const getStatusCount = (status: Booking['status']) => {
    return bookings.filter(b => b.status === status).length;
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

  const updateStatus = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setBookings(bookings.map(b =>
          b.id === bookingId ? { ...b, status: newStatus } : b
        ));
        setStatusModalOpen(false);
      } else {
        alert('Gagal mengubah status booking');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Gagal mengubah status booking');
    }
  };

  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="flex items-center gap-2 mb-6">
          <span className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg font-semibold text-sm">
            {getStatusCount('pending')} Pending
          </span>
          <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg font-semibold text-sm">
            {getStatusCount('confirmed')} Confirmed
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition ${
                  filter === filterOption
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-white text-zinc-600 border-2 border-zinc-200'
                }`}
              >
                {filterOption === 'all' ? 'Semua' : filterOption.charAt(0).toUpperCase() + filterOption.slice(1)} ({filterOption === 'all' ? bookings.length : getStatusCount(filterOption as Booking['status'])})
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Belum Ada Booking</h3>
            <p className="text-zinc-600 text-sm">Booking dari pelanggan akan muncul di sini</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((booking) => (
              <Link
                key={booking.id}
                href={`/booking/${booking.id}`}
                className="block bg-white rounded-lg sm:rounded-xl border-2 border-zinc-200 p-3 sm:p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {booking.customerName.charAt(0)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Name & Status Badge */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-zinc-900 text-sm sm:text-base truncate">
                          {booking.customerName}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-0.5">{booking.customerPhone}</p>
                      </div>

                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        <span className={`px-2 py-1 ${getStatusBadgeClass(booking.status)} rounded-md text-[10px] sm:text-xs font-bold uppercase whitespace-nowrap`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    {/* Service */}
                    <div className="mb-2">
                      <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs sm:text-sm font-semibold">
                        {booking.service.name}
                      </span>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 mb-2">
                      <span className="font-medium">
                        {new Date(booking.bookingDate).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span>•</span>
                      <span>{booking.bookingTime} WIB</span>
                    </div>

                    {booking.notes && (
                      <div className="p-2 sm:p-3 bg-zinc-50 rounded-lg mb-3">
                        <p className="text-xs sm:text-sm text-zinc-600">
                          <span className="font-semibold text-zinc-700">Catatan:</span> {booking.notes}
                        </p>
                      </div>
                    )}

                    {/* Payment Info */}
                    {booking.payment && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-zinc-700">
                          {booking.payment.method === 'cash' ? '💵 Cash' : '💳 Transfer'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          booking.payment.status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {booking.payment.status}
                        </span>
                        {booking.payment.proofUrl && (
                          <a
                            href={booking.payment.proofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-blue-600 hover:text-blue-700 underline font-medium"
                          >
                            Lihat Bukti
                          </a>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-2">
                      {/* WhatsApp */}
                      <a
                        href={`https://wa.me/${booking.customerPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-xs sm:text-sm font-semibold"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span>WhatsApp</span>
                      </a>

                      {/* Update Status */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setSelectedBooking(booking);
                          setStatusModalOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-xs sm:text-sm font-semibold"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        <span className="hidden sm:inline">Ganti Status</span>
                        <span className="sm:hidden">Status</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {statusModalOpen && selectedBooking && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setStatusModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-zinc-900 mb-4">Update Status Booking</h3>

            <div className="space-y-3 mb-6">
              {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => {
                const statusConfig = {
                  pending: { label: 'Pending', desc: 'Menunggu konfirmasi', color: 'amber' },
                  confirmed: { label: 'Confirmed', desc: 'Booking dikonfirmasi', color: 'green' },
                  completed: { label: 'Completed', desc: 'Layanan selesai', color: 'blue' },
                  cancelled: { label: 'Cancelled', desc: 'Booking dibatalkan', color: 'red' },
                };

                const config = statusConfig[status];

                return (
                  <button
                    key={status}
                    onClick={() => updateStatus(selectedBooking.id, status)}
                    className={`w-full p-4 border-2 border-zinc-200 rounded-xl hover:border-${config.color}-500 hover:bg-${config.color}-50 transition-all text-left`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-${config.color}-100 rounded-lg flex items-center justify-center`}>
                        <svg className={`w-5 h-5 text-${config.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-900">{config.label}</div>
                        <div className="text-xs text-zinc-500">{config.desc}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStatusModalOpen(false)}
              className="w-full px-4 py-3 border-2 border-zinc-300 text-zinc-700 font-semibold rounded-xl hover:bg-zinc-50 transition"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
