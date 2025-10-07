"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import useAuth from "../hooks/useAuth";
// import Lines from "./Lines";

export default function Menu() {
  const pathname = usePathname();

  return (
    <nav className="h-screen shadow-[0px_0px_10.9px_0px_rgba(0,0,0,0.25)] t z-20 flex flex-col w-[15%] bg-white p-5 items-center ">
      <Image
        src={"/Group 87.png"}
        alt="tokyo-icon"
        className="w-1/2 mt-3"
        width={100}
        height={100}
      />
      <div className="mt-10 w-full flex flex-1 flex-col items-center gap-4 text-center">
        <Link
          href={"/price-offers"}
          className={`w-full py-[6px] pr-3 text-right text-xl rounded-md text-[rgba(201,45,23,1)] font-medium ${
            pathname === "/price-offers" && "bg-[rgba(201,45,23,1)] text-white"
          }`}
        >
          הצעות
        </Link>
        <Link
          href={"/history"}
          className={`w-full py-[6px] pr-3 text-right text-xl rounded-md text-[rgba(201,45,23,1)] font-medium ${
            pathname === "/history" && "bg-[rgba(201,45,23,1)] text-white"
          }`}
        >
          היסטוריה
        </Link>
        <Link
          href={"/products"}
          className={`w-full py-[6px] pr-3 text-right text-xl rounded-md text-[rgba(201,45,23,1)] font-medium ${
            pathname === "/products" && "bg-[rgba(201,45,23,1)] text-white"
          }`}
        >
          מוצרים קבועים
        </Link>
        <Link
          href={"/units"}
          className={`w-full py-[6px] pr-3 text-right text-xl rounded-md text-[rgba(201,45,23,1)] font-medium ${
            pathname === "/units" && "bg-[rgba(201,45,23,1)] text-white"
          }`}
        >
          ניהול יחידות
        </Link>
        <Link
          href={"/vat"}
          className={`w-full py-[6px] pr-3 text-right text-xl rounded-md text-[rgba(201,45,23,1)] font-medium ${
            pathname === "/vat" && "bg-[rgba(201,45,23,1)] text-white"
          }`}
        >
          מע"מ
        </Link>
      </div>

      <div className="flex flex-col items-center gap-1 w-full ">
        <Image src={"/Group 49.png"} alt="emet" width={60} height={60} />
        <p className="text-[rgba(171,171,171,1)] ">פותח ע"י מסגרת אמ"ת</p>
      </div>
    </nav>
  );
}
