const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing demo data if any
  const existingUser = await prisma.user.findUnique({
    where: { email: 'demo@example.com' }
  });

  if (existingUser) {
    console.log('Cleaning existing demo user and linked data...');
    await prisma.user.delete({
      where: { id: existingUser.id }
    });
  }

  // Hash password with bcrypt
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);

  // 1. Create Demo User
  const demoUser = await prisma.user.create({
    data: {
      fullName: 'Demo Candidate',
      email: 'demo@example.com',
      passwordHash: passwordHash
    }
  });

  console.log(`✅ Created demo user: ${demoUser.email} (ID: ${demoUser.id})`);

  // 2. Create Project 1: Mobile App Launch (IN_PROGRESS)
  const now = new Date();
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const pastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const project1 = await prisma.project.create({
    data: {
      name: 'Mobile App Launch',
      description: 'Production release for the iOS & Android cross-platform client app',
      status: 'IN_PROGRESS',
      startDate: pastWeek,
      endDate: nextMonth,
      userId: demoUser.id,
      tasks: {
        create: [
          {
            name: 'Design Figma Mockups & Design Tokens',
            description: 'Finalize high-fidelity screens, navigation flow, and typography tokens',
            priority: 'HIGH',
            status: 'COMPLETED',
            dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
          },
          {
            name: 'Configure EAS Build & Keystore Credentials',
            description: 'Setup eas.json with Android preview profile and environment variables',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)
          },
          {
            name: 'Setup Push Notifications Service',
            description: 'Integrate Expo Notifications for deadline reminders and project updates',
            priority: 'MEDIUM',
            status: 'PENDING',
            dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    }
  });

  // 3. Create Project 2: E-Commerce Web Storefront (COMPLETED)
  const pastTwoMonths = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const project2 = await prisma.project.create({
    data: {
      name: 'E-Commerce Web Storefront',
      description: 'Modern storefront redesign with server-side rendering and Stripe checkout',
      status: 'COMPLETED',
      startDate: pastTwoMonths,
      endDate: yesterday,
      userId: demoUser.id,
      tasks: {
        create: [
          {
            name: 'Integrate Stripe Payment Gateway',
            description: 'Implement payment intents, webhook handlers, and refund processing',
            priority: 'HIGH',
            status: 'COMPLETED',
            dueDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
          },
          {
            name: 'Optimize Product Catalog Lighthouse Score',
            description: 'Achieve >95 performance score via image optimization and responsive assets',
            priority: 'MEDIUM',
            status: 'COMPLETED',
            dueDate: yesterday
          }
        ]
      }
    }
  });

  // 4. Create Project 3: Internal Analytics Dashboard (NOT_STARTED)
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const twoMonthsOut = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  const project3 = await prisma.project.create({
    data: {
      name: 'Internal Analytics Dashboard',
      description: 'Data warehouse reporting engine with automated cohort analysis and KPIs',
      status: 'NOT_STARTED',
      startDate: nextWeek,
      endDate: twoMonthsOut,
      userId: demoUser.id,
      tasks: {
        create: [
          {
            name: 'Draft Data Pipeline Architecture RFC',
            description: 'Define ETL processes, ClickHouse database schemas, and sync intervals',
            priority: 'MEDIUM',
            status: 'PENDING',
            dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000)
          },
          {
            name: 'Build Cohort Retention Visualization Widgets',
            description: 'Interactive heatmaps and multi-axis retention charts',
            priority: 'LOW',
            status: 'PENDING',
            dueDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000)
          },
          {
            name: 'Implement Role-Based Access Control (RBAC)',
            description: 'Define Admin, Manager, and Viewer permissions on report exports',
            priority: 'HIGH',
            status: 'PENDING',
            dueDate: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    }
  });

  console.log(`✅ Seeded 3 projects and 8 tasks for ${demoUser.email}`);
  console.log('🎉 Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
