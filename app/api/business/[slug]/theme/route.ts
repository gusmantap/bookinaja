import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET - Fetch current theme and category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const business = await prisma.business.findUnique({
      where: { slug },
      select: {
        theme: true,
        category: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      theme: business.theme || 'default',
      category: business.category || null,
    });
  } catch (error) {
    console.error('Error fetching theme:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update theme
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    const { slug } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { theme } = body;

    if (!theme) {
      return NextResponse.json(
        { error: 'Theme is required' },
        { status: 400 }
      );
    }

    // Check if user is owner/admin of this business
    const business = await prisma.business.findUnique({
      where: { slug },
      include: {
        members: {
          where: {
            userId: session.user.id,
            status: 'active',
          },
          include: {
            policies: true,
          },
        },
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    const member = business.members[0];
    const hasAccess = member && member.policies && member.policies.length > 0;

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Update theme
    const updatedBusiness = await prisma.business.update({
      where: { slug },
      data: { theme },
      select: {
        id: true,
        slug: true,
        theme: true,
      },
    });

    return NextResponse.json({
      success: true,
      theme: updatedBusiness.theme,
    });
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
