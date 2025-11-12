import { Router } from "express"; import { PrismaClient } from "@prisma/client"; const prisma=new PrismaClient(); export const transportRouter=Router();
transportRouter.get("/boat-roster", async (req,res)=>{ const {date}=req.query; const d=date?new Date(String(date)):new Date();
  const today=new Date(d.toDateString()); const tomorrow=new Date(d.toDateString()); tomorrow.setDate(tomorrow.getDate()+1);
  const t=await prisma.boatRoster.findUnique({where:{date:today}}).catch(()=>null); const n=await prisma.boatRoster.findUnique({where:{date:tomorrow}}).catch(()=>null);
  res.json({ today:t, tomorrow:n }); });
transportRouter.post("/boat-roster", async (req,res)=>{ const {date,boatman,phone,shift,notes}=req.body;
  const r=await prisma.boatRoster.upsert({ where:{date:new Date(new Date(date).toDateString())}, update:{boatman,phone,shift,notes},
    create:{date:new Date(new Date(date).toDateString()),boatman,phone,shift,notes} }); res.json({roster:r}); });
