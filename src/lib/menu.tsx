"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogTrigger,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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

export function CreateSetButton() {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">Create Set</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-zinc-800 border-0">
          <DialogHeader>
            <DialogTitle>Create Set</DialogTitle>
            <DialogDescription>
              Creating a set allows others to practice with and be enriched by
              the questions you create.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function CommunitySection() {
  // Get data range for infinite scroll
  const [range, setRange] = useState<number>(5);
  const [rangeLimit, setRangeLimit] = useState<number>(5);
  // Create state for set
  const [sets, setSets] = useState<any[]>([]);

  // Get Data
  useEffect(() => {
    // Invoke async
    async function getData() {
      const response = await fetch("/api/community", {
        method: "POST",
        body: JSON.stringify({
          method: "GET_SETS",
          range: range,
          rangeLimit: rangeLimit,
        }),
      });
      const data = await response.json();
      setSets(data.sets);
    }
    getData();
  }, [range, rangeLimit]);
  console.log(sets.length);
  return (
    <>
      {/* Render and update query based on filter */}
      {sets.map((set, id: number) => {
        return (
          <div key={id} className="bg-zinc-800 rounded-lg p-4 border-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-zinc-100">
                  {set.name || "Untitled Set"}
                </h3>
                <p className="text-zinc-400 text-sm mt-1">by {set.creator}</p>
              </div>
            </div>

            <p className="text-zinc-300 mt-4 text-sm line-clamp-3">
              {set.description || "No description provided."}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {set.tags.length > 0 ? (
                set.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-zinc-700 text-zinc-300 px-2 py-1 rounded-md text-xs"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="bg-zinc-700 text-zinc-300 px-2 py-1 rounded-md text-xs">
                  No tags
                </span>
              )}
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-700">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-zinc-400 text-xs">
                  <span className="bg-zinc-700 text-zinc-300 rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </span>
                  {set.questions} questions
                </div>
                <div className="flex items-center gap-1 text-zinc-400 text-xs">
                  <span className="bg-zinc-700 text-zinc-300 rounded-full p-1">
                    <User className="h-3 w-3" />
                  </span>
                  {set.plays} plays
                </div>
              </div>
              <Button
                size="sm"
                variant="default"
                className="text-xs h-8 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
              >
                View Details
              </Button>
            </div>
          </div>
        );
      })}
    </>
  );
}
