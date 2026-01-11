import { PrismaClient, Role, ProductStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function randomStatus(qty: number): ProductStatus {
  if (qty === 0) return ProductStatus.OUT_OF_STOCK;
  if (qty < 10) return ProductStatus.LOW_STOCK;
  return ProductStatus.IN_STOCK;
}

async function seedStore(storeIndex: number) {
  const PASSWORD = "password123";
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);

  // 1. Create Store
  const store = await prisma.store.create({
    data: {
      name: `Demo Store ${storeIndex}`,
      code: `STORE${storeIndex}`,
    },
  });

  // 2. Create Admin
  const admin = await prisma.user.create({
    data: {
      name: `Admin ${storeIndex}`,
      email: `admin${storeIndex}@demo.com`,
      password: hashedPassword,
      role: Role.ADMIN,
      storeId: store.id,
    },
  });

  // 3. Create Departments, Managers, and Staff
  const departmentNames = ["Electronics", "Groceries", "Furniture"];

  for (let d = 0; d < departmentNames.length; d++) {
    const deptName = departmentNames[d];

    // Create the Manager User first (departmentId is null for now)
    const manager = await prisma.user.create({
      data: {
        name: `${deptName} Manager`,
        email: `manager${storeIndex}${d}@demo.com`,
        password: hashedPassword,
        role: Role.MANAGER,
        storeId: store.id,
      },
    });

    // Create the Department and link the managerId
    const department = await prisma.department.create({
      data: {
        name: deptName,
        storeId: store.id,
        managerId: manager.id,
      },
    });

    // NOW: Update the Manager to set their departmentId
    await prisma.user.update({
      where: { id: manager.id },
      data: { departmentId: department.id },
    });

    // 4. Create Staff (2 staff members per department)
    for (let s = 1; s <= 2; s++) {
      await prisma.user.create({
        data: {
          name: `${deptName} Staff ${s}`,
          email: `staff${storeIndex}${d}${s}@demo.com`,
          password: hashedPassword,
          role: Role.STAFF,
          storeId: store.id,
          departmentId: department.id, // Linked to the department
        },
      });
    }

    // 5. Create Products
    const products = Array.from({ length: 15 }).map((_, i) => {
      const quantity = Math.floor(Math.random() * 30);
      return {
        name: `${deptName} Product ${i + 1}`,
        productCode: `${deptName.slice(0, 3).toUpperCase()}-${storeIndex}-${d}${i}`,
        quantity,
        status: randomStatus(quantity),
        departmentId: department.id,
        updatedById: admin.id,
      };
    });

    await prisma.product.createMany({ data: products });
  }
}

async function main() {
  console.log("🌱 Cleaning database...");
  // Clear existing data to avoid unique constraint errors during re-seeding
  await prisma.product.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();
  await prisma.store.deleteMany();

  console.log("🌱 Seeding database...");
  await seedStore(1);
  await seedStore(2);

  console.log("✅ Seeding completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });