"use server";

import { validate } from "@telegram-apps/init-data-node";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const JWT_SECRET = new TextEncoder().encode(process.env.SESSION_SECRET!);

interface TelegramRawUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export async function signInWithTelegram(initDataRaw: string) {
  // Still use the library for signature verification — that part works fine.
  try {
    validate(initDataRaw, BOT_TOKEN, { expiresIn: 3600 });
  } catch {
    throw new Error("Invalid Telegram init data");
  }

  // Parse the user ourselves straight from the raw query string, instead
  // of trusting parse()'s camelCase mapping.
  const params = new URLSearchParams(initDataRaw);
  const userRaw = params.get("user");
  if (!userRaw) throw new Error("No user in init data");

  let tgUser: TelegramRawUser;
  try {
    tgUser = JSON.parse(userRaw);
  } catch {
    throw new Error("Malformed user data");
  }

  const firstName =
    typeof tgUser.first_name === "string" && tgUser.first_name.length > 0
      ? tgUser.first_name
      : "Telegram User";
  const username =
    typeof tgUser.username === "string" ? tgUser.username : undefined;
  const photoUrl =
    typeof tgUser.photo_url === "string" ? tgUser.photo_url : undefined;
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

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      role: user.role,
    },
  };
}
