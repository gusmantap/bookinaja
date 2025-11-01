import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

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
  try {
    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('business_id');

    // If businessId provided, use it (for public booking form)
    if (businessId) {
      const bookings = await prisma.booking.findMany({
        where: {
          businessId,
        },
        orderBy: {
          bookingDate: 'desc',
        },
      });
      return NextResponse.json({ bookings });
    }

    // Otherwise, get bookings for authenticated user's business (for dashboard)
    const { auth } = await import('@/auth');
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user's business
    const member = await prisma.businessMember.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
      },
      select: {
        businessId: true,
      },
    });

    if (!member) {
      return NextResponse.json({ bookings: [] }, { status: 200 });
    }

    // Get all bookings for this business
    const bookings = await prisma.booking.findMany({
      where: {
        businessId: member.businessId,
      },
      include: {
        serviceDetail: {
          select: {
            id: true,
            name: true,
          },
        },
        payment: {
          select: {
            id: true,
            method: true,
            status: true,
            proofUrl: true,
            amount: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform to match frontend expectation
    const transformedBookings = bookings.map(booking => ({
      ...booking,
      service: booking.serviceDetail || { id: '', name: booking.service },
      bookingDate: booking.date.toISOString().split('T')[0],
      bookingTime: booking.time,
    }));

    return NextResponse.json({ bookings: transformedBookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
