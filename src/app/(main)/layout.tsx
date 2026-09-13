import { FavoritesProvider } from "@/context/favourites-context";
import { TelegramProvider } from "@/context/telegram-context";
import { TelegramAuth } from "@/components/primitives/telegram-auth";
import BottomNav from "@/components/blocks/bottom-nav";
import Nav from "@/components/blocks/nav"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-background relative">
      <div className="relative z-10 mb-24 mx-2">
        <Nav/>
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
