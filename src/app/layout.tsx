import "./globals.css";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return <div className="mb-24 mx-2">{children}</div>;
}
