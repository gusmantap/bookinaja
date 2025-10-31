import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
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
    const paymentMethod = formData.get('payment_method') as 'onsite' | 'transfer';
    const paymentProofFile = formData.get('payment_proof') as File | null;

    // Validate required fields
    if (!name || !phone || !date || !time || !businessId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
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
        service: 'TBD', // Will be selected from services list
        price: 0, // Will be calculated based on service
        date: new Date(date),
        time,
        duration: '30 menit', // Default duration
        status: 'pending',
        notes: notes || null,
        paymentMethod,
        paymentProofUrl,
        businessId,
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

    if (!businessId) {
      return NextResponse.json(
        { error: 'business_id is required' },
        { status: 400 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: {
        businessId,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
