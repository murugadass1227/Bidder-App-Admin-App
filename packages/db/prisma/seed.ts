import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create admin user
  const adminEmail = 'admin@bic.com';
  const adminPassword = 'admin123456';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        name: 'Admin User',
        fullName: 'Admin User',
        role: Role.ADMIN,
        emailVerifiedAt: new Date(),
        mobileVerifiedAt: new Date(),
        reservationProofVerifiedAt: new Date(),
        kycStatus: 'APPROVED',
      },
    });

    console.log('Created admin user:', admin.email);
    console.log('Admin credentials:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
  } else {
    console.log('Admin user already exists:', existingAdmin.email);
  }

  // Create a test bidder user
  const bidderEmail = 'bidder@test.com';
  const bidderPassword = 'bidder123456';

  const existingBidder = await prisma.user.findUnique({
    where: { email: bidderEmail }
  });

  if (!existingBidder) {
    const hashedPassword = await bcrypt.hash(bidderPassword, 10);
    
    const bidder = await prisma.user.create({
      data: {
        email: bidderEmail,
        passwordHash: hashedPassword,
        fullName: 'Test Bidder',
        mobile: '+26712345678',
        role: Role.BIDDER,
        emailVerifiedAt: new Date(),
        mobileVerifiedAt: new Date(),
        reservationProofVerifiedAt: new Date(),
        kycStatus: 'APPROVED',
        termsAcceptedAt: new Date(),
        privacyAcceptedAt: new Date(),
        auctionRulesAcceptedAt: new Date(),
        asIsDisclaimerAcceptedAt: new Date(),
      },
    });

    console.log('Created test bidder:', bidder.email);
    console.log('Bidder credentials:');
    console.log('Email:', bidderEmail);
    console.log('Password:', bidderPassword);
  } else {
    console.log('Test bidder already exists:', existingBidder.email);
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
