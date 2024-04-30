import React from "react";
import { Avatar } from "@nextui-org/react";
import NavBar from "@/components/navbar/navbar";
import Image from "next/image";
import DinamicTap from "@/components/profile/dynamictap";
import Footer from "../footer/footer";

function Profile() {
  return (
    <div>
      <nav>
        <div className="relative z-50 h-16 md:h-20">
          <NavBar position="fixed" />
        </div>
      </nav>
      <main className="mt-12 md:mt-8">
        <div className=" py-8 px-4 md:px-8">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden md:max-w-2xl">
            <div>
              <Image
                alt="branner"
                src={"/image/default-profile.jpg"}
                width={1000}
                height={1000}
              />
            </div>
            <div className="md:flex p-8">
              <div className="md:flex-shrink-0">
                <Avatar
                  src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                  className="w-40 h-40 md:w-36 md:h-36"
                />
              </div>
              <div className="p-4">
                <h1 className="text-xl font-semibold text-gray-800">
                  John Doe
                </h1>
                <p className="text-gray-600">Web Developer</p>
                <div className="mt-2">
                  <ul className="flex flex-wrap space-x-2">
                    <li>
                      <a href="#" className="text-blue-500 hover:text-blue-600">
                        Website
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-500 hover:text-blue-600">
                        Twitter
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-500 hover:text-blue-600">
                        LinkedIn
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-4">
              <DinamicTap />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
