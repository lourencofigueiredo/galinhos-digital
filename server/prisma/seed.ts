import { PrismaClient } from "@prisma/client"; import bcrypt from "bcryptjs"; const prisma=new PrismaClient();
async function main(){ const pwd=await bcrypt.hash("admin123",10);
  await prisma.staffUser.upsert({ where:{email:"admin@galinhos.gov.br"}, update:{}, create:{email:"admin@galinhos.gov.br",passwordHash:pwd,name:"Admin",role:"ADMIN",secretariat:"SAUDE"} });
  const now=new Date(); const m=now.getMonth(); const y=now.getFullYear(); const thu:Date[]=[];
  for(let d=1; d<=31; d++){ const dt=new Date(y,m,d); if(dt.getMonth()===m && dt.getDay()===4) thu.push(dt); }
  const target=[thu[0],thu[2]].filter(Boolean) as Date[]; for(const dt of target){ const s=new Date(dt); s.setHours(8,0,0,0); const e=new Date(dt); e.setHours(12,0,0,0);
    await prisma.scheduleSlot.create({ data:{ module:"health", code:"Dermatology", date:dt, start:s, end:e, capacity:20 } }); }
  const t0=new Date(); t0.setHours(0,0,0,0); const t1=new Date(t0); t1.setDate(t0.getDate()+1);
  await prisma.boatRoster.upsert({ where:{date:t0}, update:{}, create:{date:t0, boatman:"Zé Barqueiro", phone:"+55 84 90000-0001", shift:"08-18"} });
  await prisma.boatRoster.upsert({ where:{date:t1}, update:{}, create:{date:t1, boatman:"Naldo do Rio", phone:"+55 84 90000-0002", shift:"08-18"} });
  console.log("Seed done."); } main().finally(()=>prisma.$disconnect());
