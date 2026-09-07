import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { ProfileView } from "@/components/blocks/profile-view";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });
  if (!user) redirect("/");

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-8">
      <ProfileView user={user} />
    </div>
  );
}
