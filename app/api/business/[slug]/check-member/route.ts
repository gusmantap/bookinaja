import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    const { slug } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { hasAccess: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Optimized: Direct member lookup instead of fetching entire business
    const member = await prisma.businessMember.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
        business: {
          slug: slug,
        },
      },
      select: {
        id: true,
        role: true,
        _count: {
          select: {
            policies: true,
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { hasAccess: false, message: 'Not a member or business not found' },
        { status: 403 }
      );
    }

    // Check if user has at least one policy (meaning they have some access)
    const hasPolicies = member._count.policies > 0;

    return NextResponse.json(
      {
        hasAccess: hasPolicies,
        role: member.role,
        policiesCount: member._count.policies,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking access:', error);
    return NextResponse.json(
      { hasAccess: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
