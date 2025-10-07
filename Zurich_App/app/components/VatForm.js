import React, { useState } from "react";
import ButtonAnimation from "./ButtonAnimation";
import Image from "next/image";
import HebrewCalendar from "./HebrewCalendar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../lib/axios";
import NumberInput from "./NumberInput";

export default function VatForm(props) {
  const today = new Date();

  const [data, setData] = useState({
    start_date: today.toISOString().split("T")[0],
    end_date: getNextDay(today.toISOString().split("T")[0]),
    vat: 0,
  });
  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post("/vats", { ...data })
      .then(() => {
        toast.success("שורה נוצרה בהצלחה");
        props.closeForm();
        props.getData();
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 400 || err.response?.status === 422) {
          toast.error(err?.response?.data?.message);
        } else toast.error("התרחשה שגיאת שרת, נא לנסות שוב מאוחר יותר");
      });
  }
  function handleChange(e) {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function getNextDay(dateString) {
    const date = new Date(dateString);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    return nextDay.toISOString().split("T")[0];
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full h-[56px] text-lg text-right pr-14  gap-16 pl-10 shadow-[0px_0px_9.4px_0px_rgba(0,0,0,0.1)] bg-white  rounded-md p-1"
    >
      <div className="flex flex-1 items-center">
        <div className="w-[120px]">{props.index}</div>
        <div className="flex-1 pl-4">
          <HebrewCalendar
            setData={(value) => {
              setData((prev) => ({ ...prev, start_date: value }));
              let min = new Date(getNextDay(value));
              let end = new Date(data.end_date);
              if (min > end) {
                setData((prev) => ({ ...prev, end_date: getNextDay(value) }));
              }
            }}
            date={data.start_date}
          />
        </div>
        <div className="flex-1 pl-4">
          <HebrewCalendar
            setData={(value) =>
              setData((prev) => ({ ...prev, end_date: value }))
            }
            date={data.end_date}
            min={getNextDay(data.start_date)}
          />
        </div>
        <div className="flex-1">
          <div className="flex">
            {/* <input
              type="number"
              name="vat"
              value={data.vat}
              onChange={(e) => handleChange(e)}
              min={0}
              max={100}
              className="text-right pr-1 rounded-md bg-white border border-gray-300 ml-1"
            /> */}
            <NumberInput name='vat' value={data.vat} style='text-right pr-1 rounded-md bg-white border border-gray-300 ml-1' handleChange={(e) => handleChange(e)}/>
            <div className="">%</div>
          </div>
        </div>
      </div>
      <div className="w-[200px] flex items-center gap-1 justify-end h-full">
        <button className="bg-[rgba(62,175,63,0.21)] p-2 rounded-md">
          <Image alt={"submit"} src={"/Frame.png"} width={25} height={25} />
        </button>
        <ButtonAnimation
          animation={"/trash-open.png"}
          icon={"/trash.png"}
          size={24}
          onClick={props.closeForm}
        />
      </div>
    </form>
  );
}
