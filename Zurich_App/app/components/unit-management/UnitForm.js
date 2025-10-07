"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ButtonAnimation from "../ButtonAnimation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "@/app/lib/axios";

export default function UnitForm({
  data: initialData,
  isAddUnit,
  handleCloseForm,
  refreshProp,
  unitNumber,
  getData,
  index,
}) {
  // <-- calculating the count of the dives that can get into the page by the sizs of h,w -->
  const [isEditing, setIsEditing] = useState(true); // chang to false
  const [isDisabled, setIsDisabled] = useState(false);
  const [inputValue, setInputValue] = useState("");

  function handleCloseFormAll() {
    handleCloseForm();
    setInputValue("");
    setIsEditing(true);
    setIsDisabled(false);
  }
  // Notify Message
  const notifyMessage = (type) => {
    if (type === "add") {
      toast.success("יחידה נוספה בהצלחה", {
        position: "bottom-right",
      });
    }
  };
  const errorNofify = (type) => {
    if (type === "exist") {
      toast.error("קיימת יחידה כזאת במערכת 409", {
        position: "bottom-right",
      });
    }
    if (type === "empty") {
      toast.error("אנא הכנס ערך, בשמו של היחידה ", {
        position: "bottom-right",
      });
    } else {
      toast.error("קרתה שגיאה בעת ביצוע הפעולה, אנא נסה שוב מאוחר יותר", {
        position: "bottom-right",
      });
    }
  };
  // Add functionalty
  const handleSubmit = async (e) => {
    e.preventDefault();
    let units = [];
    units.push({
      id: e.id,
      name: e.inputValue,
    });
    if (inputValue.length > 0) {
      setIsEditing(true);
      setIsDisabled(true);
      console.log("Submitted");

      // Check if the unit already exists
      try {
        const response = await axios.get("/units");
        const existingUnits = response.data.data;

        // Check if the new unit already exists
        const unitExists = existingUnits.some(
          (unit) => unit.name === inputValue
        );

        if (unitExists) {
          // Optionally, show a notification or error message to the user
          errorNofify("exist");
          setIsEditing(true);
          setIsDisabled(false);
          return; // Exit early if the unit already exists
        }

        // Proceed with creating a new unit if it does not exist
        const newUnit = {
          name: inputValue,
        };
        await axios.post("/units", newUnit);
        notifyMessage("add");
        await getData();
        handleCloseFormAll();
      } catch (error) {
        console.error("Error submitting data:", error);
        errorNofify();
      }
    } else {
      console.log("Input is empty");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <div
        className={`rounded-xl h-[56.65px] w-full shadow-sm flex items-center justify-start cursor-pointer bg-[#FFFFFF]`}
      >
        <>
          <div className="flex w-3/4 justify-between">
            <div className="flex w-1/6 items-center justify-center ">
              <h1 className=" text-[20px] text-[#787878]">{index}</h1>
            </div>
            <div className="flex w-3/4 justify-start ">
              <input
                className={`focus:bg-[#ECECEC] border-2 text-[20px] text-[#787878] rounded-md 
                                    ${
                                      isDisabled
                                        ? "border-0 bg-transparent"
                                        : "border-0 border-[#e6e6e6]"
                                    } 
                                    ${
                                      isEditing
                                        ? ""
                                        : "border-0 border-[#e6e6e6]"
                                    }`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isDisabled}
                placeholder="שם היחידה"
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex px-10 gap-2 justify-end items-center">
              {isEditing ? (
                <button
                  type="submit"
                  className="bg-[rgba(62,175,63,0.21)] p-2 rounded-md"
                  onClick={handleSubmit}
                >
                  <Image
                    alt={"submit"}
                    src={"/Frame.png"}
                    width={25}
                    height={25}
                  />
                </button>
              ) : (
                <button onClick={handleEditClick}>
                  <ButtonAnimation
                    animation={"/pencil2.png"}
                    icon={"/pencil.png"}
                  />
                </button>
              )}
              <button
                onClick={() => {
                  handleCloseFormAll();
                }}
              >
                <ButtonAnimation
                  animation={"/trash-open.png"}
                  icon={"/trash.png"}
                  size={24}
                />
              </button>
            </div>
          </div>
        </>
      </div>
    </form>
  );
}
