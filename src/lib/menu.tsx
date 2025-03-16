"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";

export function Dropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger></DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-zinc-800 text-white flex flex-col gap-2"
        style={{
          borderColor: "#27272a",
          minWidth: "250px",
          minHeight: "150px",
        }}
      >
        <DropdownMenuLabel className="text-xl">alcuφ options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/dashboard/settings"}>
            <Settings /> Settings &amp; Management
          </Link>
        </DropdownMenuItem>{" "}
        <DropdownMenuItem asChild>
          <Link href={"/logout"}>
            <LogOut /> Logout
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    // <NavigationMenu className="bg">
    //   <NavigationMenuList>
    //     <NavigationMenuItem>
    //       <NavigationMenuTrigger className="font-extrabold">alcuφ</NavigationMenuTrigger>
    //       <NavigationMenuContent>
    //         <div className="w-[200px] p-2">
    //           <div className="text-sm font-medium text-muted-foreground mb-2 px-2">Account</div>
    //           <Link href="/logout" legacyBehavior passHref>
    //             <NavigationMenuLink
    //               className={cn(
    //                 "flex w-full items-center gap-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground",
    //               )}
    //             >
    //               <LogOut size={15} />
    //               <span>Log Out</span>
    //             </NavigationMenuLink>
    //           </Link>
    //         </div>
    //       </NavigationMenuContent>
    //     </NavigationMenuItem>
    //   </NavigationMenuList>
    // </NavigationMenu>
  );
}
