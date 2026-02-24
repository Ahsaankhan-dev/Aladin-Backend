import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "process";


export function signAccessToken(userId: string, role: string) {
  const secret = env.JWT_SECRET as Secret;
  const expiresIn = env.JWT_EXPIRES_IN as SignOptions["expiresIn"];

  return jwt.sign({ sub: userId, role }, secret, { expiresIn });
}

export function verifyToken(token: string) {
  const secret = env.JWT_SECRET as Secret;
  return jwt.verify(token, secret) as any;
}
