"use client";

import useSWR from "swr";
import axios from "../lib/axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * 
 * @param {middleware} - "auth" | "guest" 
 * @param {redirectIfAuthenticated} - "string" 
 * @returns
        user,
        isLoading,
        login,
        logout,  
 */

const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter();

  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR("/user", () =>
    axios
      .get("/user")
      .then((res) => res.data)
      .catch((error) => {
        console.log(error);
        if (error.response.status !== 409) {
          throw error;
        }
      })
  );

  const login = async ({ setErrors }) => {
    setErrors(null);
    axios


      .post("/login", { personal_number: 9804761 })

      .then(() => {
        mutate();
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.status === 403) {
          setErrors(error.response.data);
        } else if (error.response?.status !== 422) {
          throw error;
        } else {
          setErrors(error.response.data.errors);
        }
      });
  };

  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user) {
      router.push(redirectIfAuthenticated);
    }
  }, [user, error]);

  return {
    user,
    isLoading,
    login,
    error,
  };
};

export default useAuth;
