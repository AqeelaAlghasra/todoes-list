import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { primaryNavItems } from "@/utils";
import Image from "next/image";
import SearchForm from "./search-form";
import ncstLogo from "@/public/logo/ncstLogo.png";
import UserProfile from "./user-profile";

export default function MobileNav({
  navTitle = "",
  navLink = "#",
}: {
  navTitle?: string;
  navLink?: string;
}) {
  return (
    <header className="flex h-14 items-center gap-2 border-b bg-muted/40 px-2 sm:px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <UserProfile />

            {primaryNavItems.map(({ name, icon, link }, idx) => (
              <Link
                key={idx}
                href={link}
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:bg-gray-100 hover:text-foreground transition-colors"
              >
                {icon}
                {name}
              </Link>
            ))}

            <div className="flex items-center mt-6 mb-2">
              <p className="flex flex-1 text-base">My Projects</p>
            </div>
          </nav>
          <div className="mt-auto">
            <Card>
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="text-lg">Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex items-center justify-between w-full gap-1 sm:gap-2 py-2">
        <div className="lg:flex-1">
          <Link href={navLink}>
            <p className="text-sm font-semibold text-foreground/70 w-20 sm:w-24">
              {navTitle}
            </p>
          </Link>
        </div>
        <div className="flex-1 max-w-xl">
          <SearchForm />
        </div>
        <div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-20 flex items-center justify-center">
          <Image 
            alt="logo" 
            src={ncstLogo} 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </header>
  );
}
