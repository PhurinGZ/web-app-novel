"use client";
import React, { useEffect } from "react";
import { Avatar, Link } from "@nextui-org/react";

import NavBar from "@/components/navbar/navbar";
import Image from "next/image";
import DinamicTap from "@/components/profile/dynamictap";
import { redirect, useParams } from "next/navigation";
import Loading from "@/components/loading/loading";
import NotFound404 from "../notFound/404NotFound";
import { useSession } from "next-auth/react";

function Profile() {
  const { data: session, status } = useSession();

  const renderContent = () => {
    if (status === "loading") {
      return <Loading />;
    }

    if (status === "unauthenticated") {
      redirect("/membership");
    }

    if (status === "authenticated" && session.user) {
      return (
        <main className="mt-12 md:mt-8">
          <div className="py-8 px-4 md:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden md:max-w-2xl">
              <div>
                <Image
                  alt="banner"
                  src={"/image/default-profile.jpg"}
                  width={1000}
                  height={1000}
                />
              </div>
              <div className="md:flex p-8">
                <div className="md:flex-shrink-0">
                  <Avatar
                    src="http://localhost:1337/uploads/hacker_f0302061a0.png"
                    className="w-40 h-40 md:w-36 md:h-36"
                  />
                </div>
                <div className="flex p-4 items-center">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-800">
                      {session?.user?.name}
                    </h1>
                    <p className="text-gray-600">{session?.user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <DinamicTap />
              </div>
            </div>
          </div>
        </main>
      );
    }

    return <NotFound404 />;
  };

  return (
    <>
      <nav>
        <div className="relative z-50 h-16 md:h-20">
          <NavBar position="fixed" />
        </div>
      </nav>
      {renderContent()}
    </>
  );
}

export default Profile;
