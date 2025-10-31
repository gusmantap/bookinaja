import { NextRequest, NextResponse } from 'next/server';

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

    if (!id) {
      return NextResponse.json(
        { error: 'ID undangan tidak valid' },
        { status: 400 }
      );
    }

    // TODO: Implementasi berikut:
    // 1. Get current user dari session
    // 2. Cek apakah invitation ada dan milik business user ini
    // 3. Cek apakah invitation masih pending (tidak bisa cancel jika sudah accepted)
    // 4. Delete atau update status invitation menjadi 'cancelled'

    // Contoh:
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    //
    // const invitation = await prisma.invitation.findFirst({
    //   where: {
    //     id,
    //     businessId: session.user.businessId,
    //   },
    // });
    //
    // if (!invitation) {
    //   return NextResponse.json(
    //     { error: 'Undangan tidak ditemukan' },
    //     { status: 404 }
    //   );
    // }
    //
    // if (invitation.status !== 'pending') {
    //   return NextResponse.json(
    //     { error: 'Hanya undangan pending yang dapat dibatalkan' },
    //     { status: 400 }
    //   );
    // }
    //
    // await prisma.invitation.delete({
    //   where: { id },
    // });

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

/**
 * GET /api/invitations/[id]
 * Mendapatkan detail undangan berdasarkan ID atau token
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID undangan tidak valid' },
        { status: 400 }
      );
    }

    // TODO: Implementasi berikut:
    // 1. Get invitation by ID atau token
    // 2. Cek apakah invitation masih valid (belum expired)
    // 3. Return detail invitation termasuk business info

    // Contoh:
    // const invitation = await prisma.invitation.findUnique({
    //   where: { id },
    //   include: {
    //     business: {
    //       select: {
    //         name: true,
    //         subdomain: true,
    //       },
    //     },
    //   },
    // });
    //
    // if (!invitation) {
    //   return NextResponse.json(
    //     { error: 'Undangan tidak ditemukan' },
    //     { status: 404 }
    //   );
    // }
    //
    // if (new Date() > invitation.expiresAt) {
    //   return NextResponse.json(
    //     { error: 'Undangan sudah kadaluarsa' },
    //     { status: 400 }
    //   );
    // }

    // Dummy data untuk testing
    const dummyInvitation = {
      id,
      email: 'newuser@example.com',
      role: 'admin',
      status: 'pending',
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      business: {
        name: 'Komet Barbershop',
        subdomain: 'komet',
      },
    };

    return NextResponse.json({
      success: true,
      data: dummyInvitation,
    });
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil detail undangan' },
      { status: 500 }
    );
  }
}
