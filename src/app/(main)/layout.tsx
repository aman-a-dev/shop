import { FavoritesProvider } from "@/context/favourites-context";
import { TelegramProvider } from "@/context/telegram-context";
import { TelegramAuth } from "@/components/primitives/telegram-auth";
import BottomNav from "@/components/blocks/bottom-nav";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mb-24 mx-2">
      <TelegramProvider>
        <FavoritesProvider>
          {children}
          <TelegramAuth />
        </FavoritesProvider>
      </TelegramProvider>
      <BottomNav />
    </div>
  );
}
