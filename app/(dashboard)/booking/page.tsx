import { auth } from '@/auth';
import { createClient } from '@/lib/supabase/server';
import BookingListClient from './BookingListClient';

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

export default async function BookingManagementPage() {
  const startTime = performance.now();
  let authTime, dbTime, transformTime;

  console.log('[PERF] === Server Component: Booking Page START ===');

  // Auth (Server-side, no API route)
  const authStart = performance.now();
  const session = await auth();
  authTime = performance.now() - authStart;
  console.log(`[PERF] Auth time: ${authTime.toFixed(2)}ms`);

  if (!session?.user?.id) {
    return (
      <div className="bg-zinc-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-600">Tidak ada akses</p>
        </div>
      </div>
    );
  }

  // Direct Supabase query (no API route!)
  const dbStart = performance.now();
  const supabase = await createClient();

  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select(`
      *,
      serviceDetail:services(id, name),
      payment:payments(id, method, status, proofUrl, amount),
      business:businesses!inner(
        business_members!inner(userId, status)
      )
    `)
    .eq('business.business_members.userId', session.user.id)
    .eq('business.business_members.status', 'active')
    .order('createdAt', { ascending: false });

  dbTime = performance.now() - dbStart;
  console.log(`[PERF] Supabase eager loading query time: ${dbTime.toFixed(2)}ms`);

  if (bookingsError) {
    console.error('[PERF] Error fetching bookings:', bookingsError);
  }

  // Transform to match frontend expectation
  const transformStart = performance.now();
  const transformedBookings: Booking[] = (bookings || []).map((booking: any) => ({
    ...booking,
    service: booking.serviceDetail || { id: '', name: booking.service },
    bookingDate: new Date(booking.date).toISOString().split('T')[0],
    bookingTime: booking.time,
  }));
  transformTime = performance.now() - transformStart;
  console.log(`[PERF] Transform time: ${transformTime.toFixed(2)}ms`);

  const totalTime = performance.now() - startTime;
  console.log(`[PERF] === Server Component TOTAL TIME: ${totalTime.toFixed(2)}ms ===`);
  console.log(`[PERF] Breakdown - Auth: ${authTime.toFixed(2)}ms, DB: ${dbTime.toFixed(2)}ms, Transform: ${transformTime.toFixed(2)}ms, Other: ${(totalTime - authTime - dbTime - transformTime).toFixed(2)}ms`);
  console.log(`[PERF] 🎯 NO API ROUTE OVERHEAD! Direct SSR query`);

  return <BookingListClient initialBookings={transformedBookings} />;
}
