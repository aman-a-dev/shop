import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="h-screen text-center flex flex-col items-center justify-center gap-5">
      <h1 className={`text-9xl font-black`}>404</h1>
      <p>Not Found</p>
      <p>This page doesn&apos;t exist.</p>
      <Link href="/">
        <Button>Return to home</Button>
      </Link>
    </div>
  );
}
