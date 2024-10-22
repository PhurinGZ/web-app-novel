import React from "react";
import Membership from "@/components/membership/membership";
import { getCookie } from "cookies-next";
import UserProvider from "@/context/UserProvider";

function page() {
  // if (cookies) {
  //   const cookieStore = cookies();
  //   return cookieStore.getAll().map((cookie) => (
  //     <div key={cookie.name}>
  //       <p>Name: {cookie.name}</p>
  //       <p>Value: {cookie.value}</p>
  //     </div>
  //   ));
  // }

  const cookies = getCookie("token");

  if (!cookies) {
  }

  return <Membership />;
}

export default page;
