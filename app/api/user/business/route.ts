import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user's business (first business they are a member of)
    const member = await prisma.businessMember.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
      },
      include: {
        business: {
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc', // Get the first business they joined
      },
    });

    if (!member || !member.business) {
      return NextResponse.json(
        { business: null, message: 'No business found' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        business: member.business,
        role: member.role,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user business:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
