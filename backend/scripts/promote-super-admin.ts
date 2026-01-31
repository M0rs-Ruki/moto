/**
 * =============================================================
 * SUPER ADMIN PROMOTION SCRIPT
 * =============================================================
 * Creates TWO SEPARATE ORGANIZATIONS - one for each user.
 * Each user becomes Super Admin of their OWN organization.
 * They CANNOT see each other's data.
 *
 * Usage: npx ts-node scripts/promote-super-admin.ts
 * =============================================================
 */

import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

// Two separate users = Two separate organizations
const USERS_CONFIG = [
  {
    email: "cxhead@utkalautomobiles.com",
    orgName: "Utkal Automobiles Pvt Ltd",
    orgSlug: "utkal-automobiles",
  },
  {
    email: "test@google.com",
    orgName: "Test Organization",
    orgSlug: "test-organization",
  },
];

async function main() {
  console.log("=".repeat(60));
  console.log("SUPER ADMIN PROMOTION SCRIPT");
  console.log("Creating SEPARATE organizations for each user");
  console.log("=".repeat(60));
  console.log();

  for (const config of USERS_CONFIG) {
    console.log(`\n📧 Processing: ${config.email}`);
    console.log("-".repeat(40));

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: config.email },
      include: { dealership: true },
    });

    if (!user) {
      console.log(`   ❌ User not found, skipping`);
      continue;
    }

    console.log(`   Found: ${user.email} (${user.role})`);

    // Create or find organization
    let org = await prisma.organization.findUnique({
      where: { slug: config.orgSlug },
    });

    if (!org) {
      org = await prisma.organization.create({
        data: {
          name: config.orgName,
          slug: config.orgSlug,
          isActive: true,
        },
      });
      console.log(`   ✅ Created org: ${org.name}`);
    } else {
      console.log(`   ⚠️  Org exists: ${org.name}`);
    }

    // Create feature toggles
    const toggles = await prisma.orgFeatureToggle.findUnique({
      where: { organizationId: org.id },
    });

    if (!toggles) {
      await prisma.orgFeatureToggle.create({
        data: {
          organizationId: org.id,
          dashboard: true,
          dailyWalkinsVisitors: true,
          dailyWalkinsSessions: true,
          digitalEnquiry: true,
          fieldInquiry: true,
          deliveryUpdate: true,
          exportExcel: true,
          settingsProfile: true,
          settingsVehicleModels: true,
          settingsLeadSources: true,
          settingsWhatsApp: true,
        },
      });
      console.log(`   ✅ Created feature toggles`);
    }

    // Link dealership to this org
    if (user.dealership) {
      await prisma.dealership.update({
        where: { id: user.dealership.id },
        data: { organizationId: org.id },
      });
      console.log(`   ✅ Linked dealership to org`);
    }

    // Promote user to super_admin
    await prisma.user.update({
      where: { id: user.id },
      data: {
        role: UserRole.super_admin,
        organizationId: org.id,
      },
    });
        organizationId: org.id,
      },
    });
    console.log(`   ✅ Promoted to SUPER_ADMIN`);
    console.log(`   ✅ Organization: ${org.name}`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("DONE!");
  console.log("=".repeat(60));
  console.log("\nResult:");
  console.log("  • cxhead@utkalautomobiles.com → Utkal Automobiles (isolated)");
  console.log("  • test@google.com → Test Organization (isolated)");
  console.log(
    "\n⚠️  Users must LOG OUT and LOG BACK IN for changes to take effect.",
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
