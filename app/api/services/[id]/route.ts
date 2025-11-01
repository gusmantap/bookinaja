import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// PATCH - Update service (toggle active, edit, etc)
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

    // Verify service belongs to user's business
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service || service.businessId !== member.businessId) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Update service
    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        ...body,
        price: body.price ? (typeof body.price === 'string' ? parseFloat(body.price) : body.price) : undefined,
      },
    });

    return NextResponse.json(
      { service: updatedService },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete service
export async function DELETE(
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

    // Verify service belongs to user's business
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service || service.businessId !== member.businessId) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Delete service
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Service deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
