'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Dummy data - akan diganti dengan real data dari API
const stats = {
  total_bookings: 47,
  pending_bookings: 8,
  confirmed_bookings: 15,
  completed_bookings: 20,
  cancelled_bookings: 4,
  total_revenue: 23500000,
  this_month_revenue: 4750000,
  profile_views: 342,
  conversion_rate: 13.8,
};

const revenueChart = [
  { date: '25 Oct', amount: 650000 },
  { date: '26 Oct', amount: 780000 },
  { date: '27 Oct', amount: 520000 },
  { date: '28 Oct', amount: 890000 },
  { date: '29 Oct', amount: 720000 },
  { date: '30 Oct', amount: 960000 },
  { date: '31 Oct', amount: 850000 },
];

const recentBookings = [
  {
    id: 1,
    customer_name: 'Budi Santoso',
    service: 'Haircut Classic',
    date: '2025-11-01',
    time: '10:00',
    status: 'pending',
  },
  {
    id: 2,
    customer_name: 'Andi Wijaya',
    service: 'Premium Haircut',
    date: '2025-11-01',
    time: '14:00',
    status: 'confirmed',
  },
  {
    id: 3,
    customer_name: 'Rizki Firmansyah',
    service: 'Haircut + Styling',
    date: '2025-11-02',
    time: '09:00',
    status: 'pending',
  },
];

type CalendarBooking = {
  time: string;
  service: string;
  customer: string;
  price: number;
  status: 'paid' | 'pending';
};

const calendarBookings: Record<number, CalendarBooking[]> = {
  5: [
    { time: '09:00', service: 'Haircut Classic', customer: 'Budi Santoso', price: 50000, status: 'paid' },
    { time: '11:00', service: 'Premium Haircut', customer: 'Andi Wijaya', price: 100000, status: 'pending' },
    { time: '14:00', service: 'Hair Coloring', customer: 'Siti Rahayu', price: 150000, status: 'paid' },
  ],
  8: [
    { time: '09:00', service: 'Haircut Classic', customer: 'Customer 1', price: 50000, status: 'paid' },
    { time: '10:00', service: 'Haircut Classic', customer: 'Customer 2', price: 50000, status: 'paid' },
    { time: '11:00', service: 'Premium Haircut', customer: 'Customer 3', price: 100000, status: 'paid' },
    { time: '13:00', service: 'Haircut + Styling', customer: 'Customer 4', price: 75000, status: 'paid' },
    { time: '14:00', service: 'Hair Coloring', customer: 'Customer 5', price: 150000, status: 'paid' },
    { time: '16:00', service: 'Premium Haircut', customer: 'Customer 6', price: 100000, status: 'paid' },
  ],
  12: [
    { time: '10:00', service: 'Haircut + Styling', customer: 'Rizki Firmansyah', price: 75000, status: 'paid' },
    { time: '13:00', service: 'Premium Haircut', customer: 'Dedi Pratama', price: 100000, status: 'paid' },
  ],
};

export default function DashboardPage() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [slug] = useState('komet'); // TODO: Get from session/auth
  const [businessName] = useState('Komet Barbershop'); // TODO: Get from session/auth
  const [currentWeekStart, setCurrentWeekStart] = useState(1); // Start from day 1

  const maxAmount = Math.max(...revenueChart.map((d) => d.amount));

  // Week navigation functions
  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = currentWeekStart + i;
      if (day <= 30) { // November has 30 days
        days.push(day);
      }
    }
    return days;
  };

  const goToNextWeek = () => {
    const nextWeek = currentWeekStart + 7;
    if (nextWeek <= 30) {
      setCurrentWeekStart(nextWeek);
    }
  };

  const goToPrevWeek = () => {
    const prevWeek = currentWeekStart - 7;
    if (prevWeek >= 1) {
      setCurrentWeekStart(prevWeek);
    }
  };

  const getWeekRange = () => {
    const weekDays = getWeekDays();
    if (weekDays.length === 0) return '';
    const start = weekDays[0];
    const end = weekDays[weekDays.length - 1];
    return `${start}-${end} Nov 2025`;
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  const selectedBookings = selectedDay ? calendarBookings[selectedDay] || [] : [];
  const totalBookings = selectedBookings.length;
  const totalRevenue = selectedBookings.reduce((sum, b) => sum + b.price, 0);
  const availableSlots = 8 - totalBookings;

  const weekDays = getWeekDays();

  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-1">Selamat Datang! 👋</h2>
          <p className="text-sm sm:text-base text-zinc-600">Berikut ringkasan bisnis Anda hari ini</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Total Bookings */}
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-zinc-200 hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">+12%</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-0.5 sm:mb-1">{stats.total_bookings}</div>
            <div className="text-xs sm:text-sm text-zinc-600">Total Bookings</div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-zinc-200 hover:border-amber-300 transition-all">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <Link href="/booking" className="text-xs font-semibold text-amber-600 hover:text-amber-700 underline hidden sm:inline">
                Lihat
              </Link>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-0.5 sm:mb-1">{stats.pending_bookings}</div>
            <div className="text-xs sm:text-sm text-zinc-600">Pending</div>
          </div>

          {/* Confirmed */}
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-zinc-200 hover:border-green-300 transition-all">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-0.5 sm:mb-1">{stats.confirmed_bookings}</div>
            <div className="text-xs sm:text-sm text-zinc-600">Confirmed</div>
          </div>

          {/* Profile Views */}
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-zinc-200 hover:border-purple-300 transition-all">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">{stats.conversion_rate.toFixed(1)}%</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-0.5 sm:mb-1">{stats.profile_views}</div>
            <div className="text-xs sm:text-sm text-zinc-600">Profile Views</div>
          </div>
        </div>

        {/* Revenue & Recent Bookings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-zinc-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 mb-1">Revenue 7 Hari Terakhir</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-bold text-zinc-900">Rp {(stats.this_month_revenue / 1000).toLocaleString('id-ID')}K</span>
                  <span className="text-xs sm:text-sm text-green-600 font-semibold">+18.2%</span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xs text-zinc-500 mb-1">Total Revenue</div>
                <div className="text-base sm:text-lg font-bold text-zinc-900">Rp {(stats.total_revenue / 1000000).toFixed(1)}M</div>
              </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="flex items-end justify-between gap-1 sm:gap-2 h-36 sm:h-48">
              {revenueChart.map((data, idx) => {
                const height = (data.amount / maxAmount) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 sm:gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg hover:from-blue-700 hover:to-purple-700 transition-all relative group"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                        Rp {(data.amount / 1000).toLocaleString('id-ID')}K
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-xs text-zinc-600 font-medium">{data.date}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="space-y-3 sm:space-y-4">
            {/* This Month Revenue */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white">
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold opacity-90">Bulan Ini</div>
                  <div className="text-xl sm:text-2xl font-bold">Rp {(stats.this_month_revenue / 1000).toLocaleString('id-ID')}K</div>
                </div>
              </div>
              <div className="text-xs opacity-90">+18.2% dari bulan lalu</div>
            </div>

            {/* Completed */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-zinc-200">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-zinc-900">{stats.completed_bookings}</span>
              </div>
              <div className="text-xs sm:text-sm text-zinc-600">Completed</div>
              <div className="mt-1 sm:mt-2 text-xs text-green-600 font-semibold">
                {((stats.completed_bookings / stats.total_bookings) * 100).toFixed(1)}% completion rate
              </div>
            </div>

            {/* Cancelled */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-zinc-200">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-zinc-900">{stats.cancelled_bookings}</span>
              </div>
              <div className="text-xs sm:text-sm text-zinc-600">Cancelled</div>
              <div className="mt-1 sm:mt-2 text-xs text-zinc-500">
                {((stats.cancelled_bookings / stats.total_bookings) * 100).toFixed(1)}% cancellation rate
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Management Section */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-zinc-200 mb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-zinc-900">Kalender Booking</h3>
            <div className="flex gap-2">
              <button
                onClick={goToPrevWeek}
                disabled={currentWeekStart <= 1}
                className="p-1.5 hover:bg-zinc-100 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <div className="px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
                <span className="text-sm font-semibold text-purple-700 lg:hidden">{getWeekRange()}</span>
                <span className="text-sm font-semibold text-purple-700 hidden lg:inline">November 2025</span>
              </div>
              <button
                onClick={goToNextWeek}
                disabled={currentWeekStart + 7 > 30}
                className="p-1.5 hover:bg-zinc-100 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Week View for Mobile */}
          <div className="lg:hidden">
            <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide mb-6">
              {weekDays.map((day) => {
                const hasBookings = day in calendarBookings;
                const isFull = day === 8;
                const bookingCount = hasBookings ? calendarBookings[day].length : 0;
                const isSelected = selectedDay === day;
                const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
                // Nov 2025 starts on Saturday (day 6), so day 1 is Saturday
                const dayOfWeek = dayNames[(day + 4) % 7]; // Adjust offset

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`flex-shrink-0 w-20 p-3 rounded-xl transition-all snap-center ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-lg scale-105'
                        : isFull
                        ? 'bg-red-100 border-2 border-red-400 text-red-700'
                        : hasBookings
                        ? 'bg-purple-100 border-2 border-purple-400 text-purple-700'
                        : 'bg-zinc-50 border-2 border-zinc-200 text-zinc-700'
                    }`}
                  >
                    <div className="text-xs font-medium opacity-75 mb-1">{dayOfWeek}</div>
                    <div className="text-2xl font-bold mb-1">{day}</div>
                    {bookingCount > 0 && (
                      <div className={`text-xs font-semibold ${isSelected ? 'text-white' : ''}`}>
                        {bookingCount}x
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Booking Details for Mobile */}
            <div className="space-y-4">
              {!selectedDay ? (
                <div className="text-center py-8 text-zinc-500">
                  <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p className="text-sm">Pilih tanggal untuk melihat booking</p>
                </div>
              ) : selectedBookings.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p className="text-sm font-semibold mb-1">{selectedDay} November</p>
                  <p className="text-xs">Tidak ada booking</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-zinc-200">
                    <p className="text-sm font-bold text-zinc-900 mb-1">{selectedDay} November 2025</p>
                    <p className="text-xs text-zinc-600">{totalBookings} booking hari ini</p>
                  </div>

                  <div className="space-y-2">
                    {selectedBookings.map((booking, idx) => {
                      const statusColor = booking.status === 'paid' ? 'green' : 'yellow';
                      const statusLabel = booking.status === 'paid' ? 'Lunas' : 'Pending';

                      return (
                        <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg bg-${statusColor}-50 border border-${statusColor}-200`}>
                          <div className={`w-1.5 h-12 bg-${statusColor}-500 rounded-full`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-zinc-900">
                              {booking.time} - {booking.service}
                            </p>
                            <p className="text-xs text-zinc-600 truncate">
                              {booking.customer} • Rp {booking.price.toLocaleString('id-ID')}
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded bg-${statusColor}-100 text-${statusColor}-700 text-xs font-medium whitespace-nowrap`}>
                            {statusLabel}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t border-zinc-200">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-purple-50 border border-purple-200">
                        <p className="text-lg font-bold text-purple-600">{totalBookings}</p>
                        <p className="text-xs text-zinc-600">Booking</p>
                      </div>
                      <div className="p-2 rounded-lg bg-green-50 border border-green-200">
                        <p className="text-lg font-bold text-green-600">{Math.round(totalRevenue / 1000)}k</p>
                        <p className="text-xs text-zinc-600">Revenue</p>
                      </div>
                      <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="text-lg font-bold text-blue-600">{availableSlots}</p>
                        <p className="text-xs text-zinc-600">Slot Kosong</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Monthly View for Desktop */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-zinc-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for offset - November 2025 starts on Saturday (day 6) */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square"></div>
                ))}

                {/* Actual days */}
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                  const hasBookings = day in calendarBookings;
                  const isFull = day === 8;
                  const bookingCount = hasBookings ? calendarBookings[day].length : 0;

                  return (
                    <button
                      key={day}
                      onClick={() => handleDayClick(day)}
                      className={`aspect-square flex flex-col items-center justify-center text-sm rounded-lg transition-all cursor-pointer relative ${
                        isFull
                          ? 'bg-red-100 border-2 border-red-400 text-red-700 font-bold'
                          : hasBookings
                          ? 'bg-purple-100 border-2 border-purple-400 font-bold text-purple-700 hover:bg-purple-200'
                          : 'text-zinc-700 hover:bg-zinc-100 border-2 border-transparent'
                      }`}
                    >
                      <span>{day}</span>
                      {bookingCount > 0 && <span className="text-xs mt-0.5 opacity-75">{bookingCount}x</span>}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-100 border-2 border-purple-400 rounded"></div>
                  <span className="text-zinc-600">Ada Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border-2 border-red-400 rounded"></div>
                  <span className="text-zinc-600">Penuh</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-zinc-100 border-2 border-zinc-300 rounded"></div>
                  <span className="text-zinc-600">Kosong</span>
                </div>
              </div>
            </div>

            {/* Booking Details Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {!selectedDay ? (
                  <div className="text-center py-8 text-zinc-500">
                    <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="text-sm">Pilih tanggal untuk melihat booking</p>
                  </div>
                ) : selectedBookings.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500">
                    <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="text-sm font-semibold mb-1">{selectedDay} November</p>
                    <p className="text-xs">Tidak ada booking</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="pb-3 border-b border-zinc-200">
                      <p className="text-sm font-bold text-zinc-900 mb-1">{selectedDay} November 2025</p>
                      <p className="text-xs text-zinc-600">{totalBookings} booking hari ini</p>
                    </div>

                    <div className="space-y-2">
                      {selectedBookings.map((booking, idx) => {
                        const statusColor = booking.status === 'paid' ? 'green' : 'yellow';
                        const statusLabel = booking.status === 'paid' ? 'Lunas' : 'Pending';

                        return (
                          <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg bg-${statusColor}-50 border border-${statusColor}-200`}>
                            <div className={`w-1.5 h-12 bg-${statusColor}-500 rounded-full`}></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-zinc-900">
                                {booking.time} - {booking.service}
                              </p>
                              <p className="text-xs text-zinc-600 truncate">
                                {booking.customer} • Rp {booking.price.toLocaleString('id-ID')}
                              </p>
                            </div>
                            <div className={`px-2 py-1 rounded bg-${statusColor}-100 text-${statusColor}-700 text-xs font-medium whitespace-nowrap`}>
                              {statusLabel}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-zinc-200">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded-lg bg-purple-50 border border-purple-200">
                          <p className="text-lg font-bold text-purple-600">{totalBookings}</p>
                          <p className="text-xs text-zinc-600">Booking</p>
                        </div>
                        <div className="p-2 rounded-lg bg-green-50 border border-green-200">
                          <p className="text-lg font-bold text-green-600">{Math.round(totalRevenue / 1000)}k</p>
                          <p className="text-xs text-zinc-600">Revenue</p>
                        </div>
                        <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                          <p className="text-lg font-bold text-blue-600">{availableSlots}</p>
                          <p className="text-xs text-zinc-600">Slot Kosong</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-zinc-200">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-zinc-900">Booking Terbaru</h3>
            <Link href="/booking" className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700">
              Lihat Semua →
            </Link>
          </div>

          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-start gap-3 p-3 sm:p-4 border-2 border-zinc-100 rounded-lg sm:rounded-xl hover:border-blue-200 transition-all">
                {/* Avatar */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {booking.customer_name.charAt(0)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-zinc-900 text-sm sm:text-base truncate">{booking.customer_name}</div>
                      <div className="text-xs sm:text-sm text-zinc-600 mt-0.5">{booking.service}</div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      {booking.status === 'pending' ? (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[10px] sm:text-xs font-bold uppercase whitespace-nowrap">
                          Pending
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-[10px] sm:text-xs font-bold uppercase whitespace-nowrap">
                          Confirmed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 mt-1">
                    <span className="font-medium">{new Date(booking.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</span>
                    <span>•</span>
                    <span>{booking.time} WIB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <Link
            href={`/${slug}`}
            className="flex items-center gap-3 p-4 bg-white border-2 border-zinc-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group"
          >
            <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <div>
              <div className="font-semibold text-zinc-900">Lihat Profil</div>
              <div className="text-xs text-zinc-600">Preview halaman bisnis</div>
            </div>
          </Link>

          <Link
            href="/booking"
            className="flex items-center gap-3 p-4 bg-white border-2 border-zinc-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all group"
          >
            <div className="w-12 h-12 bg-green-50 group-hover:bg-green-100 rounded-lg flex items-center justify-center transition">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div>
              <div className="font-semibold text-zinc-900">Kelola Booking</div>
              <div className="text-xs text-zinc-600">Atur semua booking</div>
            </div>
          </Link>

          <Link
            href="#"
            className="flex items-center gap-3 p-4 bg-white border-2 border-zinc-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all group"
          >
            <div className="w-12 h-12 bg-purple-50 group-hover:bg-purple-100 rounded-lg flex items-center justify-center transition">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <div>
              <div className="font-semibold text-zinc-900">Pengaturan</div>
              <div className="text-xs text-zinc-600">Kelola bisnis Anda</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
