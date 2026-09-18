// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hpdc.sa' },
    update: {},
    create: {
      name: 'HPDC Admin',
      email: 'admin@hpdc.sa',
      phone_number: BigInt(966500000000),
      password: adminPassword,
      role: 'ADMIN',
      is_active: true,
    },
  });
  console.log('Admin user created:', admin.email);

  // 2. Certificate Management Types (1yr, 2yr, 3yr, 5yr)
  const certTypes = [
    {
      certificate_name: 'ESG Tayib Certificate - 1 Year',
      certificate_type: '1 Year Validity',
      duration: 1,
      application_fee: BigInt(12345),
      certificate_fee: BigInt(5000),
      status: true,
    },
    {
      certificate_name: 'ESG Tayib Certificate - 2 Years',
      certificate_type: '2 Years Validity',
      duration: 2,
      application_fee: BigInt(22000),
      certificate_fee: BigInt(8000),
      status: true,
    },
    {
      certificate_name: 'ESG Tayib Certificate - 3 Years',
      certificate_type: '3 Years Validity',
      duration: 3,
      application_fee: BigInt(30000),
      certificate_fee: BigInt(12000),
      status: true,
    },
    {
      certificate_name: 'ESG Tayib Certificate - 5 Years',
      certificate_type: '5 Years Validity',
      duration: 5,
      application_fee: BigInt(45000),
      certificate_fee: BigInt(18000),
      status: true,
    },
  ];

  for (const ct of certTypes) {
    const existing = await prisma.certificateManagement.findFirst({
      where: { certificate_type: ct.certificate_type },
    });
    if (!existing) {
      await prisma.certificateManagement.create({ data: ct });
      console.log('Created cert type:', ct.certificate_type);
    } else {
      console.log('Cert type already exists:', ct.certificate_type);
    }
  }

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
