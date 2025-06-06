
import { auth } from "@/auth";
import  Providers  from "../providers";
import { useSession } from "next-auth/react";



export default async function LoggedInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
      <Providers session={session}>{children}</Providers>
  );
}
