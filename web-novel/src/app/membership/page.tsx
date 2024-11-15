import React from "react";
import Membership from "@/components/membership/membership";


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

  return <Membership />;

}

export default page;
