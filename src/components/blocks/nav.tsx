import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="OrderPointTechStore Logo"
            width={40}
            height={40}
            className="rounded-md object-contain"
            priority
          />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Shop
          </span>
        </Link>
      </div>
    </nav>
  );
}
