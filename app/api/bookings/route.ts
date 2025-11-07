import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const notes = formData.get('notes') as string | null;
    const businessId = formData.get('business_id') as string;
    const serviceId = formData.get('service_id') as string;
    const paymentMethod = formData.get('payment_method') as 'onsite' | 'transfer';
    const paymentProofFile = formData.get('payment_proof') as File | null;

    // Validate required fields
    if (!name || !phone || !date || !time || !businessId || !serviceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get service details
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // If payment method is transfer, payment proof is required
    if (paymentMethod === 'transfer' && !paymentProofFile) {
      return NextResponse.json(
        { error: 'Payment proof is required for transfer payment' },
        { status: 400 }
      );
    }

    let paymentProofUrl: string | null = null;

    // Upload payment proof to Supabase Storage if provided
    if (paymentProofFile) {
      const supabase = await createClient();

      const fileExt = paymentProofFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `payment-proofs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, paymentProofFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload payment proof' },
          { status: 500 }
        );
      }

      // Get public URL
      const { data } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(filePath);

      paymentProofUrl = data.publicUrl;
    }

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        customerName: name,
        customerPhone: phone,
        customerEmail: null,
        service: service.name,
        serviceId: service.id,
        price: service.price,
        date: new Date(date),
        time,
        duration: service.duration,
        status: 'pending',
        notes: notes || null,
        businessId,
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: service.price,
        method: paymentMethod === 'onsite' ? 'cash' : 'transfer',
        status: paymentMethod === 'transfer' && paymentProofUrl ? 'pending' : 'pending',
        proofUrl: paymentProofUrl,
        notes: paymentMethod === 'transfer' ? 'Payment proof uploaded' : null,
      },
    });

    // Invalidate bookings cache
    revalidateTag('bookings', 'default');

    // TODO: Send WhatsApp notification to business owner and customer
    // TODO: Send confirmation email

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const startTime = performance.now();
  let authTime, dbTime1, dbTime2, transformTime;

  try {
    console.log('[PERF] === GET /api/bookings START ===');

    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('business_id');

    // If businessId provided, use it (for public booking form)
    if (businessId) {
      const dbStart = performance.now();
      const bookings = await prisma.booking.findMany({
        where: {
          businessId,
        },
        orderBy: {
          date: 'desc',
        },
      });
      dbTime1 = performance.now() - dbStart;
      console.log(`[PERF] Public bookings query time: ${dbTime1.toFixed(2)}ms`);

      const totalTime = performance.now() - startTime;
      console.log(`[PERF] === TOTAL TIME: ${totalTime.toFixed(2)}ms ===`);

      return NextResponse.json({ bookings });
    }

    // Otherwise, get bookings for authenticated user's business (for dashboard)
    const authStart = performance.now();
    const { auth } = await import('@/auth');
    const session = await auth();
    authTime = performance.now() - authStart;
    console.log(`[PERF] Auth import + execution time: ${authTime.toFixed(2)}ms`);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // OPTIMIZED: Laravel-style eager loading - single query with proper filtering
    const dbStart = performance.now();
    const supabase = await createClient();

    // TRUE EAGER LOADING: Query bookings dengan filter business_members in subquery
    // Mirip: Booking::with(['service', 'payment'])->whereHas('business.members', ...)
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

    dbTime1 = performance.now() - dbStart;
    console.log(`[PERF] Supabase eager loading query time: ${dbTime1.toFixed(2)}ms`);

    if (bookingsError) {
      console.log(`[PERF] Error fetching bookings:`, bookingsError);
      return NextResponse.json({ bookings: [] }, { status: 200 });
    }

    dbTime2 = 0; // Single eager-loaded query (like Laravel!)
    console.log(`[PERF] Single eager-loaded query (Laravel-style)! ✅`);

    // Transform to match frontend expectation
    const transformStart = performance.now();
    const transformedBookings = (bookings || []).map((booking: any) => ({
      ...booking,
      service: booking.serviceDetail || { id: '', name: booking.service },
      bookingDate: new Date(booking.date).toISOString().split('T')[0],
      bookingTime: booking.time,
    }));
    transformTime = performance.now() - transformStart;
    console.log(`[PERF] Transform time: ${transformTime.toFixed(2)}ms`);

    const totalTime = performance.now() - startTime;
    console.log(`[PERF] === TOTAL TIME: ${totalTime.toFixed(2)}ms ===`);
    console.log(`[PERF] Breakdown - Auth: ${authTime.toFixed(2)}ms, DB1: ${dbTime1.toFixed(2)}ms, DB2: ${dbTime2.toFixed(2)}ms, Transform: ${transformTime.toFixed(2)}ms, Other: ${(totalTime - authTime - dbTime1 - dbTime2 - transformTime).toFixed(2)}ms`);

    return NextResponse.json({ bookings: transformedBookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
