import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET || "dev";
export function sign(payload: object, expiresIn = "7d") {
  return jwt.sign(payload, secret, { expiresIn });
}
export function verify<T = any>(token: string) {
  return jwt.verify(token, secret) as T;
}
