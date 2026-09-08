import { FavoritesProvider } from "@/context/favourites-context";
import { TelegramProvider } from "@/context/telegram-context";
import "./globals.css";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mb-24 mx-2">
      <TelegramProvider>
        <FavoritesProvider>{children}</FavoritesProvider>
      </TelegramProvider>
    </div>
  );
}
