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
    const adminPassword = "112233";
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
    
    const adminUser = await storage.upsertUser({
      id: "admin-user-id",
      email: "admin@company.com",
      name: "Admin User",
      firstName: "Admin",
      lastName: "User",
      hashedPassword: hashedAdminPassword,
      role: "ADMIN",
    });

    console.log("✅ Admin user created:", adminUser.email);

    // Create Consultant Users
    const consultants: ConsultantData[] = [
      { name: "Sergio Bandeira", email: "sergio.bandeira@company.com", password: generateRandomPassword() },
      { name: "Mauricio Simões", email: "mauricio.simoes@company.com", password: generateRandomPassword() },
      { name: "Mayco Muniz", email: "mayco.muniz@company.com", password: generateRandomPassword() },
      { name: "Paulo Marcio", email: "paulo.marcio@company.com", password: generateRandomPassword() },
      { name: "Fernando Basil", email: "fernando.basil@company.com", password: generateRandomPassword() },
      { name: "Lucas Almeida", email: "lucas.almeida@company.com", password: generateRandomPassword() },
    ];

    console.log("\n📋 Consultant users created:");
    console.log("Email | Password");
    console.log("------|----------");

    for (const consultant of consultants) {
      const hashedPassword = await bcrypt.hash(consultant.password, 10);
      const [firstName, lastName] = consultant.name.split(" ");
      
      await storage.upsertUser({
        id: consultant.email.split("@")[0], // Use email prefix as ID
        email: consultant.email,
        name: consultant.name,
        firstName,
        lastName,
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
