"use client";
import Input from "@/app/components/Input";
import NewOffer from "@/app/components/NewOffer";
import SelectBySearch from "@/app/components/SelectBySearch";
import React, { useState } from "react";

export default function page(props) {
  return (
    <div className="h-screen ">
      <div className="w-full text-center p-3 shadow-[-6px_3px_10.6px_0px_rgba(0,0,0,0.1)] text-2xl bg-white text-[rgba(201,45,23,1)] font-bold">
        יצירת הצעה
      </div>
      <NewOffer page={props.page} />
    </div>
  );
}
