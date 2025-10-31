import { NextRequest, NextResponse } from 'next/server';

// Tipe untuk invitation request
type InvitationRequest = {
  email: string;
  role: 'admin' | 'staff';
};

// Tipe untuk invitation response
type InvitationResponse = {
  id: string;
  email: string;
  role: 'admin' | 'staff';
  status: 'pending';
  invitedAt: string;
  expiresAt: string;
};

/**
 * POST /api/invitations
 * Mengirim undangan ke email anggota baru
 */
export async function POST(request: NextRequest) {
  try {
    const body: InvitationRequest = await request.json();
    const { email, role } = body;

    // Validasi input
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email tidak valid' },
        { status: 400 }
      );
    }

    if (!role || !['admin', 'staff'].includes(role)) {
      return NextResponse.json(
        { error: 'Role tidak valid. Gunakan "admin" atau "staff"' },
        { status: 400 }
      );
    }

    // TODO: Implementasi berikut:
    // 1. Cek apakah user sudah ada di database
    // 2. Cek apakah sudah ada undangan pending untuk email ini
    // 3. Generate token unik untuk invitation
    // 4. Simpan invitation ke database dengan expiry 7 hari
    // 5. Kirim email undangan menggunakan service email (Resend, SendGrid, dll)

    // Contoh: Check if user exists
    // const existingUser = await prisma.user.findUnique({
    //   where: { email }
    // });
    //
    // if (existingUser) {
    //   return NextResponse.json(
    //     { error: 'User dengan email ini sudah terdaftar' },
    //     { status: 400 }
    //   );
    // }

    // Contoh: Create invitation
    // const token = generateSecureToken(); // Implement token generation
    // const expiresAt = new Date();
    // expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    //
    // const invitation = await prisma.invitation.create({
    //   data: {
    //     email,
    //     role,
    //     token,
    //     expiresAt,
    //     businessId: currentUser.businessId, // Get from session
    //     invitedBy: currentUser.id, // Get from session
    //   }
    // });

    // Contoh: Send email
    // await sendInvitationEmail({
    //   to: email,
    //   inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`,
    //   businessName: currentUser.businessName,
    //   role,
    // });

    // Dummy response untuk testing
    const invitationResponse: InvitationResponse = {
      id: `inv_${Date.now()}`,
      email,
      role,
      status: 'pending',
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
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
    // TODO: Implementasi berikut:
    // 1. Get current user dari session
    // 2. Get semua invitations untuk business user ini
    // 3. Return daftar invitations

    // Contoh:
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    //
    // const invitations = await prisma.invitation.findMany({
    //   where: {
    //     businessId: session.user.businessId,
    //   },
    //   orderBy: {
    //     createdAt: 'desc',
    //   },
    // });

    // Dummy data untuk testing
    const dummyInvitations = [
      {
        id: 'inv_1',
        email: 'admin@example.com',
        role: 'admin',
        status: 'accepted',
        invitedAt: '2025-10-25T10:00:00Z',
        expiresAt: '2025-11-01T10:00:00Z',
      },
      {
        id: 'inv_2',
        email: 'staff@example.com',
        role: 'staff',
        status: 'pending',
        invitedAt: '2025-10-28T14:30:00Z',
        expiresAt: '2025-11-04T14:30:00Z',
      },
    ];

    return NextResponse.json({
      success: true,
      data: dummyInvitations,
    });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data undangan' },
      { status: 500 }
    );
  }
}
