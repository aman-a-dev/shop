import "./globals.css";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mb-24 mx-2">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      {children}
    </div>
  );
}
