"use client";
import HomePage from "@/components/homePage/homePage";
import { ModalProvider } from "@/context/ModalContext";
import { NextUIProvider } from "@nextui-org/react";
import UserProvider from "@/context/UserProvider";

export default function Home() {
  return (
    <UserProvider>
      <NextUIProvider>
        <ModalProvider>
          <HomePage />
        </ModalProvider>
      </NextUIProvider>
    </UserProvider>
  );
}
