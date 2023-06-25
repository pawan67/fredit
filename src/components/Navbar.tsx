import Link from "next/link";
import React from "react";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/Button";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";
import { Search } from "lucide-react";
import SearchBar from "./SearchBar";

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className=" fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto items-center flex justify-between gap-2 ">
        {/* Logo */}
        <Link href="/" className=" flex gap-2 items-center">
          <Icons.logo className="w-8 h-8 sm:w-6 sm:h-6 " />
          <p className=" hidden text-zinc-700 font-medium text-sm md:block">
            Freddit
          </p>
        </Link>

        {/* SearchBar - pending */}
        <SearchBar />

        {/* Auth */}

        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
