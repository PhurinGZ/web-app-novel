"use client";
import React, { useEffect } from "react";
import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Card,
  CardBody,
  CardHeader,
} from "@nextui-org/react";

import Footer from "../footer/footer";
import { getCookie, setCookie } from "cookies-next";
import NavBar from "@/components/navbar/navbar";
import { useUser } from "@/context/UserProvider";
import { redirect } from "next/navigation";

interface LoginResponse {
  jwt: string;
}

export default function App() {
  const [selected, setSelected] = React.useState<string | number>("login");
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loginsucess, setLoginsucess] = React.useState(false);
  const { updateUser, user } = useUser();

  const cookie = getCookie("token");

  const onChangePassword = (v) => {
    setPassword(v);
  };

  const onChangeEmail = (v) => {
    setIdentifier(v);
  };

  useEffect(() => {
    if (cookie) {
      setLoginsucess(true);
      redirect("/");
    }
  }, [cookie]);

  const handleLogin = async (
    identifier: string,
    password: string
  ): Promise<void> => {
    try {
      const res = await fetch("http://localhost:1337/api/auth/local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      if (!res.ok) {
        throw new Error("Failed to login");
      }

      const data: LoginResponse = await res.json();
      const { jwt, user } = data;

      console.log(user);

      updateUser(user);

      // console.log(user?.username)

      // window.location.reload();

      // Set cookie
      setCookie("token", jwt, {
        expires: new Date(Date.now() + 60 * 60 * 24 * 3),
      });
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleSubmit = async () => {
    await handleLogin(identifier, password);
  };

  return (
    <>
      <nav>
        <div className="relative z-[200] h-[50px] md:h-[60px] ">
          <NavBar position={"fixed"} />
        </div>
      </nav>
      <main className="mt-12 my-12 md:mt-8 md:my-8">
        <div className="flex justify-center">
          <Card className="max-w-full w-[340px] h-[400px]">
            <CardBody className="overflow-hidden">
              <Tabs
                fullWidth
                size="md"
                aria-label="Tabs form"
                selectedKey={selected}
                onSelectionChange={setSelected}
              >
                <Tab key="login" title="Login">
                  <form className="flex flex-col gap-4">
                    <Input
                      value={identifier}
                      isRequired
                      label="Email"
                      placeholder="Enter your email"
                      type="email"
                      onChange={(e) => onChangeEmail(e.target.value)}
                    />
                    <Input
                      isRequired
                      value={password}
                      label="Password"
                      placeholder="Enter your password"
                      type="password"
                      onChange={(e) => onChangePassword(e.target.value)}
                    />
                    <p className="text-center text-small">
                      Need to create an account?{" "}
                      <Link size="sm" onPress={() => setSelected("sign-up")}>
                        Sign up
                      </Link>
                    </p>
                    <div className="flex gap-2 justify-end">
                      <Button
                        fullWidth
                        color="primary"
                        onClick={() => handleSubmit()}
                      >
                        Login
                      </Button>
                    </div>
                  </form>
                </Tab>
                <Tab key="sign-up" title="Sign up">
                  <form className="flex flex-col gap-4 h-[300px]">
                    <Input
                      isRequired
                      label="Name"
                      placeholder="Enter your name"
                      type="password"
                    />
                    <Input
                      isRequired
                      label="Email"
                      placeholder="Enter your email"
                      type="email"
                    />
                    <Input
                      isRequired
                      label="Password"
                      placeholder="Enter your password"
                      type="password"
                    />
                    <p className="text-center text-small">
                      Already have an account?{" "}
                      <Link size="sm" onPress={() => setSelected("login")}>
                        Login
                      </Link>
                    </p>
                    <div className="flex gap-2 justify-end">
                      <Button fullWidth color="primary">
                        Sign up
                      </Button>
                    </div>
                  </form>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        </div>
      </main>
      
    </>
  );
}
