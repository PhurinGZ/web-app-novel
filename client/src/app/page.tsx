"use client";
import HomePage from "@/components/homePage/homePage";
import { ModalProvider } from "@/context/ModalContext";
import { NextUIProvider } from "@nextui-org/react";

export default function Home() {
  return (
    <NextUIProvider>
      <ModalProvider>
        <HomePage />
      </ModalProvider>
    </NextUIProvider>
  );
}
