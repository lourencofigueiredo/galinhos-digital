import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const webhookRouter = Router();

// Inbound from WhatsApp/n8n -> create ticket
webhookRouter.post("/whatsapp-inbound", async (req, res) => {
  const { phone, cpf, name, message, attachments, type, secretariat, fields } = req.body;
  if (!cpf || !phone) return res.status(400).json({ error: "cpf and phone required" });

  const citizen = await prisma.citizen.upsert({
    where: { cpf },
    update: { phone, name: name ?? undefined },
    create: { cpf, phone, name: name ?? "Cidadão" }
  });

  const number = "GD-" + Math.floor(1e6 + Math.random() * 9e6).toString();
  const t = await prisma.ticket.create({
    data: {
      number, type, secretariat,
      citizenId: citizen.id,
      fields: { ...(fields ?? {}), message },
      attachments: attachments ?? [],
      history: [{ at: new Date().toISOString(), action: "OPEN", source: "whatsapp" }]
    }
  });

  res.json({ ok: true, ticket_number: t.number, ticket_id: t.id, next: "app://ticket/" + t.id });
});
