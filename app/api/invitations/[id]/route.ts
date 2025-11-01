import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createBusinessMember, MemberRole } from '@/lib/pbac';

/**
 * GET /api/invitations/[id]
 * Mendapatkan detail invitation berdasarkan token
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: token } = await params;

    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        business: {
          select: {
            name: true,
            slug: true,
          },
        },
        inviter: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Undangan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date() > invitation.expiresAt) {
      return NextResponse.json(
        { error: 'Undangan sudah kadaluarsa' },
        { status: 400 }
      );
    }

    // Check if already accepted/rejected
    if (invitation.status !== 'pending') {
      return NextResponse.json(
        { error: `Undangan sudah ${invitation.status}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data undangan' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/invitations/[id]/accept
 * Accept atau reject invitation
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: token } = await params;
    const { action, userId } = await request.json(); // action: 'accept' | 'reject', userId from session

    if (!action || !['accept', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action harus "accept" atau "reject"' },
        { status: 400 }
      );
    }

    if (action === 'accept' && !userId) {
      return NextResponse.json(
        { error: 'User ID harus disertakan untuk accept invitation' },
        { status: 400 }
      );
    }

    // Get invitation
    const invitation = await prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Undangan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Validasi
    if (new Date() > invitation.expiresAt) {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'expired' },
      });

      return NextResponse.json(
        { error: 'Undangan sudah kadaluarsa' },
        { status: 400 }
      );
    }

    if (invitation.status !== 'pending') {
      return NextResponse.json(
        { error: `Undangan sudah ${invitation.status}` },
        { status: 400 }
      );
    }

    if (action === 'accept') {
      // Accept invitation - create business member
      await prisma.$transaction(async (tx) => {
        // Create business member with role from invitation
        await createBusinessMember(
          userId,
          invitation.businessId,
          invitation.role as MemberRole,
          invitation.invitedBy
        );

        // Update invitation status
        await tx.invitation.update({
          where: { id: invitation.id },
          data: {
            status: 'accepted',
            acceptedAt: new Date(),
          },
        });

        // Create audit log
        await tx.auditLog.create({
          data: {
            userId,
            businessId: invitation.businessId,
            action: 'accept_invitation',
            entityType: 'invitation',
            entityId: invitation.id,
            metadata: {
              email: invitation.email,
              role: invitation.role,
            },
          },
        });
      });

      return NextResponse.json({
        success: true,
        message: 'Undangan berhasil diterima',
        data: {
          id: invitation.id,
          status: 'accepted',
          businessId: invitation.businessId,
        },
      });
    } else {
      // Reject invitation
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'rejected' },
      });

      return NextResponse.json({
        success: true,
        message: 'Undangan ditolak',
        data: {
          id: invitation.id,
          status: 'rejected',
        },
      });
    }
  } catch (error) {
    console.error('Error processing invitation:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses undangan' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/invitations/[id]
 * Membatalkan undangan yang masih pending
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // TODO: Verify user has permission to cancel this invitation

    const invitation = await prisma.invitation.findUnique({
      where: { id },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Undangan tidak ditemukan' },
        { status: 404 }
      );
    }

    if (invitation.status !== 'pending') {
      return NextResponse.json(
        { error: 'Hanya undangan pending yang dapat dibatalkan' },
        { status: 400 }
      );
    }

    await prisma.invitation.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Undangan berhasil dibatalkan',
    });
  } catch (error) {
    console.error('Error cancelling invitation:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membatalkan undangan' },
      { status: 500 }
    );
  }
}
