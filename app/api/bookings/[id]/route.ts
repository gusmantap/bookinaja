import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidateTag } from 'next/cache';

// PATCH - Update booking status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Get user's business to verify ownership
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
      return NextResponse.json(
        { error: 'No business found' },
        { status: 404 }
      );
    }

    // Verify booking belongs to user's business
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking || booking.businessId !== member.businessId) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        serviceDetail: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Invalidate bookings cache
    revalidateTag('bookings', 'default');

    // Transform to match frontend expectation
    const transformed = {
      ...updatedBooking,
      service: updatedBooking.serviceDetail || { id: '', name: updatedBooking.service },
      bookingDate: updatedBooking.date.toISOString().split('T')[0],
      bookingTime: updatedBooking.time,
    };

    return NextResponse.json(
      { booking: transformed },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get booking detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

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
      return NextResponse.json(
        { error: 'No business found' },
        { status: 404 }
      );
    }

    // Get booking detail
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        serviceDetail: true,
        business: {
          select: {
            id: true,
            name: true,
            phone: true,
            address: true,
          },
        },
      },
    });

    if (!booking || booking.businessId !== member.businessId) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Transform to match frontend expectation
    const transformed = {
      ...booking,
      service: booking.serviceDetail || { id: '', name: booking.service },
      bookingDate: booking.date.toISOString().split('T')[0],
      bookingTime: booking.time,
    };

    return NextResponse.json(
      { booking: transformed },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
