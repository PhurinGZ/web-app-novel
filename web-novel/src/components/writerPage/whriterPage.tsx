// writerPage.tsx
"use client";
import React from "react";
import NavBar from "@/components/navbar/navbar";
import Footer from "../footer/footer";
import User from "@/components/writerPage/user";
import Tabs from "./taps";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function WriterPage() {
  const router = useRouter()
  return (
    <div>
      <main>
        <div className="container mx-auto py-8">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold text-start mb-8 ml-3.5 ">
              หน้านักเขียน
            </h1>
            <Button className="bg-[#F5A524] mr-8" onClick={() => router.push("/book/add-novel")}>
              <Image src={"/icon/plus.svg"} height={10} width={10} alt="plus" />{" "}
              <span>เขียนนิยาย</span>
            </Button>
          </div>
          <div className="flex flex-col md:flex-row justify-start items-center md:items-start md:ml-10 border-solid border-2 border-gray-400 p-4 rounded-md mx-8">
            <User />
          </div>
          <div className=" mt-4">
            <Tabs />
          </div>
        </div>
      </main>
    </div>
  );
}

export default WriterPage;
