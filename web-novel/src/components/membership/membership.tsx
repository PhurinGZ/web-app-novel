"use client";

import { useState, useEffect } from "react";

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
import NavBar from "@/components/navbar/navbar";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "../loading/loading";

interface LoginResponse {
  jwt: string;
}

export default function App() {
  const [selected, setSelected] = useState<string | number>("login");
  const [formDataSignin, setFormDataSignin] = useState({
    email: "",
    password: "",
  });
  const [loginsucess, setLoginsucess] = useState(false);
  const [formDataSignup, setFormDataSignup] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  console.log("session ", session);
  console.log("status ", status);

  useEffect(() => {
    if (status === "authenticated") {
      redirect("/");
    }
  }, [status]);

  // handle submit Signin
  const handleSubmitSignin = async (e) => {
    e.preventDefault();

    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: formDataSignin.email,
      password: formDataSignin.password,
    });

    if (res.ok) {
      setLoading(false);
      router.push("/");
    }

    if (res?.error) {
      // Display error to the user
      console.error("Login error:", res.error);
      alert(res.error); // Or handle error display in a more user-friendly way
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <Loading />; // Show loading if status is loading or loading state is true
  }

  //handle submit Signup
  const handleSubmitSignup = async (e) => {

    setLoading(true);

    e.preventDefault();
    const res = await fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formDataSignup),
    });
    if (res.ok) {
      setLoading(false);
      setSelected("login");
    } else {

      setLoading(false);

      // Parse the response to get the message
      const data = await res.json();
      alert(data.message || "Signup failed");
      console.log(data.message);
    }
  };

  return (
    <>
      <div className="mt-12 my-12 md:my-28">
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
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmitSignin}
                  >
                    <Input
                      value={formDataSignin.email}
                      isRequired
                      label="Email"
                      placeholder="Enter your email"
                      type="email"
                      onChange={(e) =>
                        setFormDataSignin({
                          ...formDataSignin,
                          email: e.target.value,
                        })
                      }
                    />
                    <Input
                      isRequired
                      value={formDataSignin.password}
                      label="Password"
                      placeholder="Enter your password"
                      type="password"
                      onChange={(e) =>
                        setFormDataSignin({
                          ...formDataSignin,
                          password: e.target.value,
                        })
                      }
                    />
                    <p className="text-center text-small">
                      Need to create an account?{" "}
                      <Link size="sm" onPress={() => setSelected("sign-up")}>
                        Sign up
                      </Link>
                    </p>
                    <div className="flex gap-2 justify-end">
                      <Button fullWidth color="primary" type="submit">
                        Login
                      </Button>
                    </div>
                  </form>
                </Tab>
                <Tab key="sign-up" title="Sign up">
                  <form
                    className="flex flex-col gap-4 h-[300px]"
                    onSubmit={handleSubmitSignup}
                  >
                    <Input
                      isRequired
                      label="Name"
                      placeholder="Enter your name"
                      type="text"
                      onChange={(e) =>
                        setFormDataSignup({
                          ...formDataSignup,
                          username: e.target.value,
                        })
                      }
                      required
                    />
                    <Input
                      isRequired
                      label="Email"
                      placeholder="Enter your email"
                      type="email"
                      onChange={(e) =>
                        setFormDataSignup({
                          ...formDataSignup,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                    <Input
                      isRequired
                      label="Password"
                      placeholder="Enter your password"
                      type="password"
                      onChange={(e) =>
                        setFormDataSignup({
                          ...formDataSignup,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <p className="text-center text-small">
                      Already have an account?{" "}
                      <Link size="sm" onPress={() => setSelected("login")}>
                        Login
                      </Link>
                    </p>
                    <div className="flex gap-2 justify-end">
                      <Button fullWidth color="primary" type="submit">
                        Sign up
                      </Button>
                    </div>
                  </form>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
