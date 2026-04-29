import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_please_change";

interface AuthPayload {
  userId: string;
  role: string;
}

export function verifyAuth(req: Request): AuthPayload | null {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  const tokenMatch = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("token="));
  if (!tokenMatch) return null;

  const token = tokenMatch.split("=")[1];
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    return { userId: payload.userId, role: payload.role };
  } catch {
    return null;
  }
}
