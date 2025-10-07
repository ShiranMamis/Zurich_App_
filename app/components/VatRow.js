import React, { useState } from "react";
import ButtonAnimation from "./ButtonAnimation";
import axios from "../lib/axios";
import { toast } from "react-toastify";
import DeletePopUp from "./global/DeletePopUp";

export default function VatRow(props) {
  const [isDelete, setIsDelete] = useState(false);

  function handleDelete() {
    axios
      .delete(`/vats/${props.row.id}`)
      .then((res) => {
        toast.success("שורה נמחקה בהצלחה");
        setIsDelete(false);
        props.getData();
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 400 || err.response.status === 422) {
          toast.error(err?.response?.data?.message);
        } else toast.error("התרחשה שגיאת שרת, נא לנסות שוב מאוחר יותר");
      })
      .finally(() => props.getData());
  }
  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }
  return (
    <div className="flex w-full h-[56px] text-lg text-right pr-14  gap-16 pl-10 shadow-[0px_0px_9.4px_0px_rgba(0,0,0,0.1)] bg-white  rounded-md p-1">
      <div className="flex flex-1 items-center">
        <div className="w-[120px]">{props.index}</div>
        <div className="flex-1">{formatDate(props.row.start_date)} </div>
        <div className="flex-1"> {formatDate(props.row.end_date)}</div>
        <div className="flex-1">{props.row.vat}%</div>
      </div>
      <div className="w-[200px] flex justify-end">
        <ButtonAnimation
          animation={"/trash-open.png"}
          icon={"/trash.png"}
          size={24}
          onClick={() => setIsDelete(true)}
        />
      </div>
      {isDelete && (
        <DeletePopUp
          handleDeleteProp={handleDelete}
          HandleClose={() => setIsDelete(false)}
          type={"vat"}
          name={`${props.row.vat} אחוז מעמ`}
        />
      )}
    </div>
  );
}
