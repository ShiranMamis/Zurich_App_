"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MoneyAnimation from "./components/MoneyAnimation";
import useAuth from "./hooks/useAuth";

export default function Home() {
  const { user, login } = useAuth({ middleware: "guest" });
  const [errors, setErrors] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        router.push("/price-offers");
      }, [2000]);
    } else login({ setErrors });
  }, [user]);

  return (
    <div className="fixed inset-0 flex flex-col bg-white items-center justify-center pb-4 z-50">
      <div className="w-full h-full absolute inset-0">
        <MoneyAnimation />
      </div>

      <Image
        width={200}
        height={200}
        src={"/zurich-icon.png"}
        alt="zurich icon"
        className="w-1/4 h-2/5 z-20"
      />
    </div>
  );
}
