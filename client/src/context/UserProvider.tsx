"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

// Define the type for user data
interface UserData {
  id: number;
  email: string;
  username: string;
  blocked: boolean;
  confirmed: boolean;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

// Define the type for the context value
interface UserContextType {
  user: UserData | undefined;
  updateUser: (userData: UserData | undefined) => void;
}

// Creating a context for the user data
const UserContext = createContext<UserContextType | undefined>(undefined);

// Creating a UserProvider component
function UserProvider({ children }: { children: ReactNode }) {
  // State to hold user data
  const [user, setUser] = useState<UserData | undefined>();
  const [decodedToken, setDecodedToken] = useState<any>();
  const [error, setError] = useState();

  const token = getCookie("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:1337/api/users/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Wait for the response body to be parsed as JSON
        const data = await res.json();
        if (data.error) {
          setError(data.error);
        }
        
        // console.log(data);
        setUser(data);
      } catch (error) {
        // Handle errors
        console.error("Error fetching data:", error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, [token]);

  // Function to set user data
  const updateUser = (userData: UserData | undefined) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use user context
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export default UserProvider;
