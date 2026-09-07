import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.SESSION_SECRET!);

export async function getSession() {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: number; role: string };
  } catch {
    return null;
  }
}
