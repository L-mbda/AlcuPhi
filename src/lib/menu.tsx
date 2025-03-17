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
import { CSSProperties, useEffect, useState } from "react";

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
  // States
  const [range, setRange] = useState(5);
  const [rangeLimit, setRangeLimit] = useState(5);
  const [sets, setSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Make empty array
  const skeleton = new Array(5).fill({});

  // Backend rendering logic
  useEffect(() => {
    async function getData() {
      const response = await fetch("/api/community", {
        method: "POST",
        body: JSON.stringify({
          method: "GET_SETS",
          range,
          rangeLimit,
        }),
      });
      const data = await response.json();
      setSets(data.sets);
      setLoading(false);
    }
    getData();
  }, [range, rangeLimit]);

  // Style override because tailwind wouldnt work properly
  // for grids
  const gridContainerStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px",
    width: "90%",
  };

  const gridItemStyle: React.CSSProperties = {
    backgroundColor: "#27272a",
    borderRadius: "0.5rem",
    padding: "0.75rem",
    color: "#d4d4d8",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#f4f4f5",
    margin: 0,
  };

  const creatorStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    color: "#a1a1aa",
    marginTop: "0.25rem",
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    marginTop: "1rem",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    color: "#d4d4d8",
  };

  const tagStyle: React.CSSProperties = {
    backgroundColor: "#3f3f46",
    color: "#d4d4d8",
    padding: "0.25rem 0.5rem",
    borderRadius: "0.375rem",
    fontSize: "0.75rem",
  };

  const bottomSectionStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "1.5rem",
    paddingTop: "1rem",
    borderTop: "1px solid #3f3f46",
  };

  const statsStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    fontSize: "0.75rem",
    color: "#a1a1aa",
  };

  const statItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  const iconWrapperStyle: CSSProperties = {
    backgroundColor: "#3f3f46",
    color: "#d4d4d8",
    borderRadius: "9999px",
    padding: "0.125rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  if (loading) {
    return (
      <div style={{ width: "100%" }} className="flex justify-center">
        <div style={gridContainerStyle}>
          {skeleton.map((set, id) => (
            <div key={id} style={gridItemStyle} className="animate-pulse">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  {/* Title Placeholder */}
                  <div
                    style={{
                      ...titleStyle,
                      backgroundColor: "#e5e7eb",
                      width: "150px",
                      height: "24px",
                      borderRadius: "4px",
                    }}
                  ></div>
                  {/* Creator Placeholder */}
                  <div
                    style={{
                      ...creatorStyle,
                      backgroundColor: "#e5e7eb",
                      width: "100px",
                      height: "16px",
                      borderRadius: "4px",
                      marginTop: "0.5rem",
                    }}
                  ></div>
                </div>
              </div>

              {/* Description Placeholder */}
              <div
                style={{
                  ...descriptionStyle,
                  backgroundColor: "#e5e7eb",
                  width: "100%",
                  height: "48px",
                  borderRadius: "4px",
                  marginTop: "0.5rem",
                }}
              ></div>

              {/* Additional badge placeholders (e.g., for tags or metadata) */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "1rem",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#e5e7eb",
                    width: "50px",
                    height: "20px",
                    borderRadius: "4px",
                  }}
                ></div>
                <div
                  style={{
                    backgroundColor: "#e5e7eb",
                    width: "50px",
                    height: "20px",
                    borderRadius: "4px",
                  }}
                ></div>
              </div>

              <div style={bottomSectionStyle}>
                <div style={statsStyle}>
                  <div style={statItemStyle}>
                    {/* Icon Placeholder */}
                    <span
                      style={{
                        ...iconWrapperStyle,
                        backgroundColor: "#e5e7eb",
                        borderRadius: "50%",
                        width: "12px",
                        height: "12px",
                        display: "inline-block",
                      }}
                    ></span>
                    {/* Text Placeholder for "0 questions" */}
                    <div
                      style={{
                        backgroundColor: "#e5e7eb",
                        width: "40px",
                        height: "14px",
                        borderRadius: "4px",
                        marginLeft: "0.5rem",
                      }}
                    ></div>
                  </div>
                  <div style={statItemStyle}>
                    <span
                      style={{
                        ...iconWrapperStyle,
                        backgroundColor: "#e5e7eb",
                        borderRadius: "50%",
                        width: "12px",
                        height: "12px",
                        display: "inline-block",
                      }}
                    ></span>
                    {/* Text Placeholder for "0 plays" */}
                    <div
                      style={{
                        backgroundColor: "#e5e7eb",
                        width: "40px",
                        height: "14px",
                        borderRadius: "4px",
                        marginLeft: "0.5rem",
                      }}
                    ></div>
                  </div>
                </div>
                {/* Button Placeholder */}
                <div
                  style={{
                    backgroundColor: "#e5e7eb",
                    width: "100px",
                    height: "32px",
                    borderRadius: "4px",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  // Content
  return (
    <>
      {sets.length > 0 ? (
        <div style={{ width: "100%" }} className="flex justify-center">
          <div style={gridContainerStyle}>
            {sets.map((set, id) => (
              <div key={id} style={gridItemStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h3 style={titleStyle}>{set.name || "Untitled Set"}</h3>
                    <p style={creatorStyle}>by {set.creator}</p>
                  </div>
                </div>

                <p style={descriptionStyle}>
                  {set.description || "No description provided."}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginTop: "1rem",
                  }}
                >
                  {set.tags.length > 0 ? (
                    set.tags.map((tag, index) => (
                      <span key={index} style={tagStyle}>
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span style={tagStyle}>No tags</span>
                  )}
                </div>

                <div style={bottomSectionStyle}>
                  <div style={statsStyle}>
                    <div style={statItemStyle}>
                      <span style={iconWrapperStyle}>
                        <Check
                          style={{ width: "0.75rem", height: "0.75rem" }}
                        />
                      </span>
                      {set.questions} questions
                    </div>
                    <div style={statItemStyle}>
                      <span style={iconWrapperStyle}>
                        <User style={{ width: "0.75rem", height: "0.75rem" }} />
                      </span>
                      {set.plays} plays
                    </div>
                  </div>
                  <Button>View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <h1 className="text-white">No sets found</h1>
      )}
    </>
  );
}
