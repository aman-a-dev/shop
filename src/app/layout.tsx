import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Shop",
  description: "Online Shop",
};
