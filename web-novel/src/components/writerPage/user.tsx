// user.tsx
import React from "react";
import { User, Link } from "@nextui-org/react";
import { useSession } from "next-auth/react";

export default function App() {

  const {data: session} = useSession()

  return (
    <User
      name={session?.user?.name}
      description={(
        <Link href="https://github.com/PhurinGZ" size="sm" isExternal>
          @PhurinGZ
        </Link>
      )}
      avatarProps={{
        src: "https://avatars.githubusercontent.com/u/120617446?s=400&u=7bdedc5d7cdaf5d837f8ba624999801cb7200ccc&v=4 "
      }}
      className="flex items-center space-x-4"
      // nameClassName="text-xl font-bold text-gray-800"
      // descriptionClassName="text-gray-500"
      // descriptionWrapperClassName="mt-1"
    />
  );
}
