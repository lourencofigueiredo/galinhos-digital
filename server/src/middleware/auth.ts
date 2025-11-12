import { Request, Response, NextFunction } from "express"; import { verify } from "../utils/jwt.js";
export function requireStaff(req:Request,res:Response,next:NextFunction){ const hdr=req.headers.authorization;
  if(!hdr) return res.status(401).json({error:"Missing token"});
  try{ (req as any).user = verify(hdr.replace("Bearer ","")); next(); } catch{ return res.status(401).json({error:"Invalid token"}); } }
