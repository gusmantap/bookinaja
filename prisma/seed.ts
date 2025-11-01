import { PrismaClient } from '@prisma/client';
import { createBusinessMember, MemberRole } from '../lib/pbac';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create dummy user untuk testing
  const user = await prisma.user.upsert({
    where: { email: 'owner@test.com' },
    update: {},
    create: {
      email: 'owner@test.com',
      name: 'Test Owner',
      onboardingCompleted: true,
    },
  });

  console.log('✅ Created user:', user.email);

  // Create dummy business
  const business = await prisma.business.upsert({
    where: { slug: 'test-business' },
    update: {},
    create: {
      slug: 'test-business',
      name: 'Test Business',
      bio: 'Ini adalah bisnis untuk testing',
      phone: '08123456789',
      address: 'Jl. Test No. 123',
    },
  });

  console.log('✅ Created business:', business.name);

  // Create business member with owner role + policies
  const existingMember = await prisma.businessMember.findUnique({
    where: {
      userId_businessId: {
        userId: user.id,
        businessId: business.id,
      },
    },
  });

  if (!existingMember) {
    await createBusinessMember(user.id, business.id, MemberRole.OWNER);
    console.log('✅ Created business member with OWNER policies');
  } else {
    console.log('⚠️  Business member already exists');
  }

  // Create dummy services
  const service1 = await prisma.service.upsert({
    where: { id: 'service-1' },
    update: {},
    create: {
      id: 'service-1',
      name: 'Haircut',
      price: 50000,
      duration: '30 menit',
      businessId: business.id,
      isActive: true,
    },
  });

  const service2 = await prisma.service.upsert({
    where: { id: 'service-2' },
    update: {},
    create: {
      id: 'service-2',
      name: 'Hair Coloring',
      price: 150000,
      duration: '60 menit',
      businessId: business.id,
      isActive: true,
    },
  });

  console.log('✅ Created services:', service1.name, service2.name);

  console.log('🎉 Seed completed!');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
