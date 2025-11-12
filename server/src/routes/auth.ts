import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sign } from "../utils/jwt.js";
const prisma = new PrismaClient();
export const authRouter = Router();

// Citizen OTP-like login (mock)
authRouter.post("/citizen/login", async (req, res) => {
  const { cpf, phone, name } = req.body;
  if (!cpf || !phone) return res.status(400).json({ error: "cpf, phone required" });
  const citizen = await prisma.citizen.upsert({
    where: { cpf },
    create: { cpf, phone, name: name ?? "Cidadão" },
    update: { phone, name: name ?? undefined }
  });
  const token = sign({ sub: citizen.id, kind: "citizen" }, "30d");
  res.json({ token, citizen });
});

// Staff login (email/password)
authRouter.post("/staff/login", async (req, res) => {
  const { email, password } = req.body;
  const u = await prisma.staffUser.findUnique({ where: { email } });
  if (!u) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, u.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = sign({ sub: u.id, role: u.role, secretariat: u.secretariat, kind: "staff" }, "7d");
  res.json({ token, staff: { id: u.id, name: u.name, role: u.role, secretariat: u.secretariat } });
});
