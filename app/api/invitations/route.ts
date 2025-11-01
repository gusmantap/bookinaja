import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MemberRole } from '@/lib/pbac';
import crypto from 'crypto';

// Tipe untuk invitation request
type InvitationRequest = {
  email: string;
  role: MemberRole;
  businessId: string;
  userId: string; // Inviter user ID from session
};

// Tipe untuk invitation response
type InvitationResponse = {
  id: string;
  email: string;
  role: string;
  status: 'pending';
  invitedAt: string;
  expiresAt: string;
};

/**
 * Generate secure token for invitation
 */
function generateInvitationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * POST /api/invitations
 * Mengirim undangan ke email anggota baru
 */
export async function POST(request: NextRequest) {
  try {
    const body: InvitationRequest = await request.json();
    const { email, role, businessId, userId } = body;

    // Validasi input
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email tidak valid' },
        { status: 400 }
      );
    }

    if (!role || !Object.values(MemberRole).includes(role)) {
      return NextResponse.json(
        { error: 'Role tidak valid' },
        { status: 400 }
      );
    }

    if (!businessId || !userId) {
      return NextResponse.json(
        { error: 'Business ID dan User ID harus disertakan' },
        { status: 400 }
      );
    }

    // Check if user already exists and is a member
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const existingMember = await prisma.businessMember.findUnique({
        where: {
          userId_businessId: {
            userId: existingUser.id,
            businessId,
          },
        },
      });

      if (existingMember) {
        return NextResponse.json(
          { error: 'User sudah menjadi anggota bisnis ini' },
          { status: 400 }
        );
      }
    }

    // Check if pending invitation already exists
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email,
        businessId,
        status: 'pending',
      },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'Undangan untuk email ini sudah dikirim sebelumnya' },
        { status: 400 }
      );
    }

    // Generate token dan expiry
    const token = generateInvitationToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        email,
        role,
        token,
        expiresAt,
        businessId,
        invitedBy: userId,
        status: 'pending',
      },
      include: {
        business: {
          select: {
            name: true,
          },
        },
      },
    });

    // TODO: Send email menggunakan service email (Resend, SendGrid, dll)
    // const inviteUrl = `${process.env.NEXT_PUBLIC_HOST}/invite/${token}`;
    // await sendInvitationEmail({
    //   to: email,
    //   inviteUrl,
    //   businessName: invitation.business.name,
    //   role,
    // });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        businessId,
        action: 'invite_member',
        entityType: 'invitation',
        entityId: invitation.id,
        metadata: {
          email,
          role,
        },
      },
    });

    const invitationResponse: InvitationResponse = {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      status: 'pending',
      invitedAt: invitation.createdAt.toISOString(),
      expiresAt: invitation.expiresAt.toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Undangan berhasil dikirim',
        data: invitationResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengirim undangan' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/invitations
 * Mendapatkan daftar semua undangan untuk bisnis ini
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID harus disertakan' },
        { status: 400 }
      );
    }

    // TODO: Verify user has permission to view invitations for this business

    const invitations = await prisma.invitation.findMany({
      where: {
        businessId,
      },
      include: {
        inviter: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: invitations,
    });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data undangan' },
      { status: 500 }
    );
  }
}
