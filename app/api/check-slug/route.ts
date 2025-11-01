import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug harus disertakan' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingBusiness = await prisma.business.findUnique({
      where: { slug },
    });

    if (existingBusiness) {
      return NextResponse.json(
        { available: false, message: 'URL sudah digunakan' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { available: true, message: 'URL tersedia' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking slug:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengecek URL' },
      { status: 500 }
    );
  }
}
