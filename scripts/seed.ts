import { storage } from "../server/storage";
import bcrypt from "bcrypt";

interface ConsultantData {
  name: string;
  email: string;
  password: string;
}

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Create Admin User
    const adminPassword = "g147g147g147";
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
    
    const adminUser = await storage.createUser({
      id: "admin-user-id",
      email: "admin@company.com",
      name: "Admin User",
      hashedPassword: hashedAdminPassword,
      role: "ADMIN",
    });

    console.log("✅ Admin user created:", adminUser.email);

    // Create Consultant Users
    const consultants: ConsultantData[] = [
      { name: "Sergio Bandeira", email: "sergio.bandeira@company.com", password: "123" },
      { name: "Mauricio Simões", email: "mauricio.simoes@company.com", password: "124" },
      { name: "Mayco Muniz", email: "mayco.muniz@company.com", password: "125" },
      { name: "Paulo Marcio", email: "paulo.marcio@company.com", password: "126" },
      { name: "Fernando Basil", email: "fernando.basil@company.com", password: "127" },
    ];

    console.log("\n📋 Consultant users created:");
    console.log("Email | Password");
    console.log("------|----------");

    for (const consultant of consultants) {
      const hashedPassword = await bcrypt.hash(consultant.password, 10);
      const [firstName, lastName] = consultant.name.split(" ");
      
      await storage.createUser({
        id: consultant.email.split("@")[0], // Use email prefix as ID
        email: consultant.email,
        name: consultant.name,
        hashedPassword,
        role: "CONSULTANT",
      });

      console.log(`${consultant.email} | ${consultant.password}`);
    }

    console.log("\n🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

function generateRandomPassword(): string {
  // Generate a random 3-digit password
  return Math.floor(100 + Math.random() * 900).toString();
}

// Run the seed function
seed();
