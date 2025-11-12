import { Router } from "express"; import { PrismaClient } from "@prisma/client"; const prisma=new PrismaClient(); export const healthRouter=Router();
healthRouter.get("/specialties", (_req,res)=>res.json({items:["Dermatology","Cardiology","Pediatrics"]}));
healthRouter.get("/specialties/:name/slots", async (req,res)=>{ const {name}=req.params; const {month}=req.query as any;
  const slots=await prisma.scheduleSlot.findMany({ where:{module:"health",code:name,date:{gte:new Date(`${month}-01`),lt:new Date(`${month}-31`) }}, orderBy:{date:"asc"} });
  res.json({slots}); });
healthRouter.post("/appointments", async (req,res)=>{ const {ticketId,slotId}=req.body; const slot=await prisma.scheduleSlot.findUnique({where:{id:slotId}});
  if(!slot) return res.status(404).json({error:"slot not found"}); if(slot.taken>=slot.capacity) return res.status(400).json({error:"slot full"});
  const appt=await prisma.$transaction(async tx=>{ const a=await tx.appointment.create({data:{ticketId,slotId}}); await tx.scheduleSlot.update({where:{id:slotId},data:{taken:{increment:1}}});
    await tx.ticket.update({where:{id:ticketId},data:{status:"SCHEDULED"}}); return a; }); res.json({appointment:appt}); });
