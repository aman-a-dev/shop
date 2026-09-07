import BottomNav from "@/components/blocks/bottom-nav";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <div>
      {children}
      <BottomNav />
    </div>
  );
}
