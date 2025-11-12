import { Request, Response, NextFunction } from "express";
import { verify } from "../utils/jwt.js";
export function requireStaff(req: Request, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization;
  if (!hdr) return res.status(401).json({ error: "Missing token" });
  try {
    const data = verify(hdr.replace("Bearer ", ""));
    (req as any).user = data;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
