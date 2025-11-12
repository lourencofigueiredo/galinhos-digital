import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const pwd = await bcrypt.hash("admin123", 10);
  await prisma.staffUser.upsert({
    where: { email: "admin@galinhos.gov.br" },
    update: {},
    create: { email: "admin@galinhos.gov.br", passwordHash: pwd, name: "Admin", role: "ADMIN", secretariat: "SAUDE" }
  });

  // Health demo slots: Dermatology 1st & 3rd Thursdays 08–12 (20 capacity) current month
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const thursdays: Date[] = [];
  for (let d = 1; d <= 31; d++) {
    const dt = new Date(year, month, d);
    if (dt.getMonth() === month && dt.getDay() === 4) thursdays.push(dt);
  }
  const target = [thursdays[0], thursdays[2]].filter(Boolean);
  for (const dt of target) {
    const start = new Date(dt); start.setHours(8, 0, 0, 0);
    const end = new Date(dt); end.setHours(12, 0, 0, 0);
    await prisma.scheduleSlot.create({
      data: { module: "health", code: "Dermatology", date: dt, start, end, capacity: 20 }
    });
  }

  // Boat roster demo today/tomorrow
  const t0 = new Date(); t0.setHours(0,0,0,0);
  const t1 = new Date(t0); t1.setDate(t0.getDate()+1);
  await prisma.boatRoster.upsert({
    where: { date: t0 },
    update: {},
    create: { date: t0, boatman: "Zé Barqueiro", phone: "+55 84 90000-0001", shift: "08-18" }
  });
  await prisma.boatRoster.upsert({
    where: { date: t1 },
    update: {},
    create: { date: t1, boatman: "Naldo do Rio", phone: "+55 84 90000-0002", shift: "08-18" }
  });

  console.log("Seed done.");
}

main().finally(() => prisma.$disconnect());
