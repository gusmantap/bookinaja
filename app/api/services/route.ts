import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET - Fetch all services for user's business
export async function GET() {
  try {
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
      return NextResponse.json(
        { services: [] },
        { status: 200 }
      );
    }

    // Get all services for this business
    const services = await prisma.service.findMany({
      where: {
        businessId: member.businessId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(
      { services },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new service
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, duration, price } = body;

    if (!name || !duration || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
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

    // Create service
    const service = await prisma.service.create({
      data: {
        name,
        duration,
        price: typeof price === 'string' ? parseFloat(price) : price,
        businessId: member.businessId,
        isActive: true,
      },
    });

    return NextResponse.json(
      { service },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
