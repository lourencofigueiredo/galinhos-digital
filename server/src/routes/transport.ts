import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const transportRouter = Router();

// Public: today/tomorrow boat roster
transportRouter.get("/boat-roster", async (req, res) => {
  const { date } = req.query;
  const d = date ? new Date(String(date)) : new Date();
  const todayDate = new Date(d.toDateString());
  const tomorrowDate = new Date(d.toDateString()); tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const today = await prisma.boatRoster.findUnique({ where: { date: todayDate } }).catch(() => null);
  const tomorrow = await prisma.boatRoster.findUnique({ where: { date: tomorrowDate } }).catch(() => null);
  res.json({ today, tomorrow });
});

// Staff: set roster
transportRouter.post("/boat-roster", async (req, res) => {
  const { date, boatman, phone, shift, notes } = req.body;
  const r = await prisma.boatRoster.upsert({
    where: { date: new Date(new Date(date).toDateString()) },
    update: { boatman, phone, shift, notes },
    create: { date: new Date(new Date(date).toDateString()), boatman, phone, shift, notes }
  });
  res.json({ roster: r });
});
