"use client";

import { Menu } from "@mantine/core";
import { LogOut } from "lucide-react";
import Link from "next/link";

export function DropdownMenu() {
  return (
    <Menu
      shadow="md"
      width={200}
      trigger="click-hover"
      openDelay={100}
      closeDelay={400}
    >
      <Menu.Target>
        <h1 className="font-extrabold">alcuφ</h1>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Account</Menu.Label>
        {/* Logout mode */}
        <Menu.Item
          component={Link}
          href={"/logout"}
          leftSection={<LogOut size={15} />}
        >
          Log Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export function GameCard() {
  return (
    <Link
    href="/dashboard/play"
    className="relative group rounded-lg min-h-[25vh] overflow-hidden justify-center items-center"
    >
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"
        style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/6/6f/CMB_Timeline300_no_WMAP.jpg')" }}
      ></div>
      <div className="relative z-10 flex flex-col justify-center h-full items-center p-6">
        <h2 className="text-2xl font-extrabold text-white">Play</h2>
        <p className="mt-2 font-semibold text-gray-300">CORE FUNCTIONALITY</p>
        <p className="mt-1 font-['Mulish'] font-extrabold text-gray-400 text-center">
          Improve your Physics Knowledge
        </p>
      </div>
    </Link>
  )
}