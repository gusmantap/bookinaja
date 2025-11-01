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

    // Check if user has policy access to this business
    const business = await prisma.business.findUnique({
      where: { slug },
      include: {
        members: {
          where: {
            userId: session.user.id,
            status: 'active',
          },
          include: {
            policies: true, // Include policies to check access
          },
        },
      },
    });

    if (!business) {
      return NextResponse.json(
        { hasAccess: false, message: 'Business not found' },
        { status: 404 }
      );
    }

    // User is a member and has active status
    const member = business.members[0];
    const hasAccess = !!member;

    // Check if user has at least one policy (meaning they have some access)
    const hasPolicies = member?.policies && member.policies.length > 0;

    return NextResponse.json(
      {
        hasAccess: hasAccess && hasPolicies,
        role: member?.role || null,
        policiesCount: member?.policies?.length || 0,
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
