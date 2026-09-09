import { Bot, webhookCallback } from "grammy";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.command("start", async (ctx) => {
  const webAppUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://shop-et.vercel.app";
  const supportUrl = "https://t.me/Aman_a_dev";

  await ctx.reply(
    "Welcome to our shop! 🛍️\n\nUse the buttons below to open the shop or contact support.",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🛒 Open Shop", web_app: { url: webAppUrl } },
            { text: "💬 Support", url: supportUrl },
          ],
        ],
      },
    },
  );
});

bot.on("message", async (ctx) => {
  await ctx.reply("Send /start to see the menu.");
});

// Type assertion to bypass the type error – works at runtime
export const POST = webhookCallback(bot, "next" as any);

// Optional: a GET handler for testing/webhook verification
export async function GET() {
  return new Response("Webhook is ready", { status: 200 });
}
