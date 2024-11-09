"use client"

import React from "react";
import { Search } from "lucide-react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Spinner,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import AcmeLogo from "./AcmeLogo";
import Image from "next/image";
import Category from "../category/categoy";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const NavBar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false);
  const { data: session, status } = useSession();

  return (
    <>
      <Navbar
        className="bg-navbar-color sticky"
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarBrand className="flex space-x-10">
          <div className="flex items-center">
            <Link href="/" color="foreground">
              <AcmeLogo />
              <p className="font-bold text-white">ACME</p>
            </Link>
          </div>
          <div>
            <NavbarContent className="hidden sm:flex gap-4">
              <NavbarItem>
                <button
                  type="button"
                  className="inline-flex justify-center shadow-sm px-4 py-2 text-sm font-medium text-white focus:outline-none"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  <Image
                    src="/image/list.png"
                    width={100}
                    height={100}
                    alt="list"
                    className="max-w-5 in-h-5 cursor-pointer"
                  />
                  <p className="ml-2">หมวดหมู่</p>
                </button>
              </NavbarItem>
            </NavbarContent>
          </div>
        </NavbarBrand>

        <NavbarContent as="div" justify="end" className="flex items-center gap-4">
          <button 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => router.push('/search')}
          >
            <Search className="w-5 h-5 text-white" />
          </button>

          {status === "loading" ? (
            <Spinner size="sm" color="white" />
          ) : status === "authenticated" ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name="Jason Hughes"
                  size="sm"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2" href="/profile">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{session?.user?.email}</p>
                </DropdownItem>
                <DropdownItem key="system" href="/whriter">
                  นักเขียน
                </DropdownItem>
                <DropdownItem key="settings">My Settings</DropdownItem>
                <DropdownItem key="team_settings">Team Settings</DropdownItem>
                <DropdownItem key="analytics">Analytics</DropdownItem>
                <DropdownItem key="configurations">Configurations</DropdownItem>
                <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <div>
              <Link href="/membership">Login/registe</Link>
            </div>
          )}
        </NavbarContent>
      </Navbar>

      {isCategoryOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCategoryOpen(false)}
        >
          <div className="absolute inset-0 mt-10 z-50">
            <Category onClose={() => setIsCategoryOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;