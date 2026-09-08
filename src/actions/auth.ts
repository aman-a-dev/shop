"use server";

import { validate, parse } from "@telegram-apps/init-data-node";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const JWT_SECRET = new TextEncoder().encode(process.env.SESSION_SECRET!);

export async function signInWithTelegram(initDataRaw: string) {
  try {
    validate(initDataRaw, BOT_TOKEN, { expiresIn: 3600 });
  } catch {
    throw new Error("Invalid Telegram init data");
  }

  const { user: tgUser } = parse(initDataRaw);
  if (!tgUser) throw new Error("No user in init data");

  const firstName =
    typeof tgUser.firstName === "string" && tgUser.firstName.length > 0
      ? tgUser.firstName
      : "Telegram User";
  const username =
    typeof tgUser.username === "string" ? tgUser.username : undefined;
  const photoUrl =
    typeof tgUser.photoUrl === "string" ? tgUser.photoUrl : undefined;
  const telegramId = String(tgUser.id);

  const user = await prisma.user.upsert({
    where: { telegramId },
    update: { name: firstName, username, avatar: photoUrl },
    create: { telegramId, name: firstName, username, avatar: photoUrl },
  });

  const token = await new SignJWT({ userId: user.id, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return { success: true, userId: user.id };
}
