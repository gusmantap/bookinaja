import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createBusinessMember, MemberRole } from '@/lib/pbac';

type ServiceInput = {
  name: string;
  price: number;
  duration: string;
};

type OnboardingRequest = {
  subdomain: string;
  name: string;
  bio: string;
  phone: string;
  address: string;
  email?: string;
  instagram?: string;
  services: ServiceInput[];
  operatingHours: any;
  userId: string; // User ID dari session
};

export async function POST(request: NextRequest) {
  try {
    const body: OnboardingRequest = await request.json();

    console.log('Onboarding request body:', JSON.stringify(body, null, 2));

    const {
      subdomain,
      name,
      bio,
      phone,
      address,
      email,
      instagram,
      services,
      operatingHours,
      userId,
    } = body;

    // Validasi
    if (!subdomain || !name || !bio || !phone || !address || !userId) {
      console.error('Validation failed:', {
        subdomain: !!subdomain,
        name: !!name,
        bio: !!bio,
        phone: !!phone,
        address: !!address,
        userId: !!userId,
      });
      return NextResponse.json(
        { error: 'Data tidak lengkap', details: { subdomain: !!subdomain, name: !!name, bio: !!bio, phone: !!phone, address: !!address, userId: !!userId } },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingBusiness = await prisma.business.findUnique({
      where: { slug: subdomain },
    });

    if (existingBusiness) {
      return NextResponse.json(
        { error: 'Subdomain sudah digunakan' },
        { status: 400 }
      );
    }

    // Create business dengan transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create business
      const business = await tx.business.create({
        data: {
          slug: subdomain,
          name,
          bio,
          phone,
          address,
          email,
          instagram,
          whatsapp: phone, // Default whatsapp = phone
          operatingHours: operatingHours || {},
        },
      });

      // 2. Create services
      if (services && services.length > 0) {
        await tx.service.createMany({
          data: services.map(service => ({
            name: service.name,
            price: typeof service.price === 'string' ? parseFloat(service.price) : service.price,
            duration: service.duration,
            businessId: business.id,
            isActive: true,
          })),
        });
      }

      // 3. Create business member dengan OWNER role + full policies
      await createBusinessMember(userId, business.id, MemberRole.OWNER, undefined, tx);

      // 4. Update user onboardingCompleted
      await tx.user.update({
        where: { id: userId },
        data: { onboardingCompleted: true },
      });

      // 5. Create audit log
      await tx.auditLog.create({
        data: {
          userId,
          businessId: business.id,
          action: 'create_business',
          entityType: 'business',
          entityId: business.id,
          metadata: {
            businessName: name,
            slug: subdomain,
          },
        },
      });

      return business;
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Bisnis berhasil dibuat',
        data: {
          businessId: result.id,
          slug: result.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating business:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat bisnis' },
      { status: 500 }
    );
  }
}
