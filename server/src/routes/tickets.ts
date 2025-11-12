import { Router } from "express"; import { PrismaClient, TicketStatus } from "@prisma/client"; import { requireStaff } from "../middleware/auth.js";
const prisma=new PrismaClient(); export const ticketRouter=Router();
ticketRouter.post("/", async (req,res)=>{ const {type,secretariat,fields,attachments,citizen}=req.body; if(!citizen?.cpf) return res.status(400).json({error:"citizen.cpf required"});
  const c=await prisma.citizen.upsert({ where:{cpf:citizen.cpf}, update:{name:citizen.name??undefined,phone:citizen.phone??undefined,email:citizen.email??undefined,address:citizen.address??undefined},
    create:{cpf:citizen.cpf,name:citizen.name??"Cidadão",phone:citizen.phone??""} });
  const number="GD-"+Math.floor(1e6+Math.random()*9e6).toString();
  const t=await prisma.ticket.create({ data:{ number,type,secretariat,citizenId:c.id,fields:fields??{},attachments:attachments??[],history:[{at:new Date().toISOString(),action:"OPEN"}] } });
  res.json({ticket:t}); });
ticketRouter.get("/", requireStaff, async (req,res)=>{ const {status,type,secretariat}=req.query;
  const tickets=await prisma.ticket.findMany({ where:{ status:status?(status as TicketStatus):undefined, type:type?(type as any):undefined, secretariat:secretariat?(secretariat as any):undefined }, orderBy:{createdAt:"desc"} });
  res.json({tickets}); });
ticketRouter.patch("/:id", requireStaff, async (req,res)=>{ const {id}=req.params; const {status,assignedToId,psfAuthorized,fields}=req.body;
  const t=await prisma.ticket.update({ where:{id}, data:{status,assignedToId,psfAuthorized,fields} }); res.json({ticket:t}); });
