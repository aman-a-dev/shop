import { FavoritesProvider } from "@/context/favourites-context";
import { TelegramProvider } from "@/context/telegram-context";
import { TelegramAuth } from "@/components/primitives/telegram-auth";
import BottomNav from "@/components/blocks/bottom-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-background relative">
      {/* Grid background – absolute behind everything */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />

      {/* Content with higher z-index */}
      <div className="relative z-10 mb-24 mx-2">
        <TelegramProvider>
          <FavoritesProvider>
            {children}
            <TelegramAuth />
          </FavoritesProvider>
        </TelegramProvider>
        <BottomNav />
      </div>
    </div>
  );
}
