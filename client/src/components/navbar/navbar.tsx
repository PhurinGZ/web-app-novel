"use client";
import React from "react";
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

const App = ({ position }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Navbar
      className={`bg-navbar-color ${position}`}
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

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
              <Link color="foreground" href="#" className="text-white">
                <Image
                  src={"/image/list.png"}
                  width={100}
                  height={100}
                  alt="list"
                  className="max-w-5 in-h-5"
                />
                <p className="ml-2 text-xl">หมวดหมู่</p>
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

      <NavbarMenu>
        <NavbarMenuItem>GG1</NavbarMenuItem>
        <NavbarMenuItem>GG1</NavbarMenuItem>
        <NavbarMenuItem>GG1</NavbarMenuItem>
        <NavbarMenuItem>GG1</NavbarMenuItem>
      </NavbarMenu>

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
              href={`/profile/gg`}
            >
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="system" href="/whriter">
              นักเขียน
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};

export default App;
