import React from "react";
import { Tabs, Tab, Card, CardBody, CardHeader } from "@nextui-org/react";
import Favorite from "./favorite";
import useSWR from "swr";
import Loading from "../loading/loading";
import { getCookie } from "cookies-next";

interface TabItem {
  id: string;
  label: string;
  content: string;
}

const App: React.FC = () => {
  const fetcher = (url, token) => {
    return fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };

  const token = getCookie("token");

  const fetcherWithToken = (url) => fetcher(url, token);

  const { data, error } = useSWR(
    "http://localhost:1337/api/users/me?populate=*",
    fetcherWithToken
  );
  if (!data) return <Loading />;
  if (error) return <div>{error.message}</div>;

  console.log(data.favorite_novels);

  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Dynamic tabs">
        <Tab title="Favorite">
          {data.favorite_novels.map((fav) => (
            <Favorite
              title={fav.name}
              description={null}
              key={fav.id}
              imageUrl={null}
              name={fav.name}
            />
          ))}
        </Tab>
        <Tab title="อ่านล่าสุด" isDisabled>
          <Card>
            <CardBody></CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default App;
