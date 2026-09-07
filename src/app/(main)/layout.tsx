import "./globals.css";
import BottomNav from "@/components/blocks/bottom-nav";
import { FavoritesProvider } from "@/context/favourites-context";
import { TelegramProvider } from "@/context/telegram-context";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mb-24 mx-2">
      <TelegramProvider>
        <FavoritesProvider>{children}</FavoritesProvider>
      </TelegramProvider>
      <BottomNav />
    </div>
  );
}
