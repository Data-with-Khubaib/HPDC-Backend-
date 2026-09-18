const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hpdc.sa' },
    update: {},
    create: {
      email: 'admin@hpdc.sa',
      password: hashedPassword,
      name: 'Super Admin',
      phone_number: BigInt(966500000000),
      role: 'ADMIN',
      is_active: true,
    },
  });
  console.log('Admin created:', admin.email);
}

main().catch(console.error).finally(() => prisma.$disconnect());
