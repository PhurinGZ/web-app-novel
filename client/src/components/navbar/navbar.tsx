"use client";

import React, { useEffect } from "react";

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
} from "@nextui-org/react";
import AcmeLogo from "./AcmeLogo";
import Image from "next/image";

import { useUser } from "@/context/UserProvider";
import { getCookie, deleteCookie } from "cookies-next";
import Category from "../category/categoy";

const App = ({ position }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const cookies = getCookie("token");
  const { user } = useUser();
  // console.log(user?.username);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    deleteCookie("token", { path: "/" });
    window.location.href = "/membership";
  };


  return (
    <Navbar
      className={`bg-navbar-color ${position}`}
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >

      {isOpen && <Category />}
      <Image
        src={"/image/list.png"}
        width={100}
        height={100}
        alt="list"
        className="max-w-5 in-h-5 sm:hidden cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />


      <NavbarBrand className="flex space-x-10 ">
        <div className="flex items-center">
          <Link href="/" color="foreground">
            <AcmeLogo />
            <p className="font-bold text-white">ACME</p>
          </Link>
        </div>
        <div>
          <NavbarContent className="hidden sm:flex gap-4">
            <NavbarItem>
              <Link color="foreground" className="text-white">
                {/* <p className="ml-2 text-xl">หมวดหมู่</p> */}
                <button
                  type="button"
                  className="inline-flex justify-center shadow-sm px-4 py-2 text-sm font-medium text-white focus:outline-none"
                  id="options-menu"
                  aria-expanded="true"
                  aria-haspopup="true"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <Image
                    src={"/image/list.png"}
                    width={100}
                    height={100}
                    alt="list"
                    className="max-w-5 in-h-5"
                  />
                  <p className="ml-2">หมวดหมู่</p>
                </button>

              </Link>
            </NavbarItem>
            {/* <NavbarItem isActive>
          <Link
            href="#"
            aria-current="page"
            color="secondary"
            className="text-white"
          >
            About us
          </Link>
        </NavbarItem> */}
          </NavbarContent>
        </div>
      </NavbarBrand>


      {cookies ? (
        <NavbarContent as="div" justify="end">
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
              <DropdownItem
                key="profile"
                className="h-14 gap-2"
                href={`/profile/${user?.username}`}
              >
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user?.email}</p>
              </DropdownItem>
              <DropdownItem key="system" href="/whriter">
                นักเขียน
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="team_settings">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onClick={() => handleLogout()}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      ) : (
        <div>
          <Link href="/membership">Login/registe</Link>
        </div>
      )}

    </Navbar>
  );
};

export default App;
