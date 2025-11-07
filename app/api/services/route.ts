import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { unstable_cache, revalidateTag } from 'next/cache';

// Cache function for fetching services
const getServicesForUser = unstable_cache(
  async (userId: string) => {
    const member = await prisma.businessMember.findFirst({
      where: {
        userId,
        status: 'active',
      },
      select: {
        businessId: true,
        business: {
          select: {
            services: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        },
      },
    });

    return member?.business.services ?? [];
  },
  ['user-services'],
  {
    revalidate: 30, // Cache for 30 seconds
    tags: ['services'],
  }
);

// GET - Fetch all services for user's business
export async function GET() {
  const startTime = performance.now();
  let authTime, dbTime;

  try {
    console.log('[PERF] === GET /api/services START ===');

    const authStart = performance.now();
    const session = await auth();
    authTime = performance.now() - authStart;
    console.log(`[PERF] Auth time: ${authTime.toFixed(2)}ms`);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get services with caching
    const dbStart = performance.now();
    const services = await getServicesForUser(session.user.id);
    dbTime = performance.now() - dbStart;
    console.log(`[PERF] Database query time: ${dbTime.toFixed(2)}ms`);

    const totalTime = performance.now() - startTime;
    console.log(`[PERF] === TOTAL TIME: ${totalTime.toFixed(2)}ms ===`);
    console.log(`[PERF] Breakdown - Auth: ${authTime.toFixed(2)}ms, DB: ${dbTime.toFixed(2)}ms, Other: ${(totalTime - authTime - dbTime).toFixed(2)}ms`);

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

    // Invalidate services cache
    revalidateTag('services', 'default');

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
