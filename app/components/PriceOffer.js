import Image from "next/image";
import React, { useState } from "react";
import ButtonAnimation from "./ButtonAnimation";
import { CircleCheck, CircleX, Clock3, X } from "lucide-react";
import NewOffer from "./NewOffer";
import axios from "../lib/axios";
import { toast } from "react-toastify";
import DeletePopUp from "./global/DeletePopUp";
import ChangeStatus from "./ChangeStatus";

export default function PriceOffer(props) {
  const [statusClicked, setStatusClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  function handleDelete() {
    axios
      .delete(`/priceoffers/${props.offer.id}`)
      .then((res) => {
        toast.success("שורה נמחקה מהמערכת בהצלחה");
        setIsDelete(false);
        props.getData();
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 400 || err.response.status === 422) {
          toast.error(err?.response?.data?.message);
        } else toast.error("התרחשה שגיאת שרת, נא לנסות שוב מאוחר יותר");
      });
  }

  function handleResend(status) {
    let message =
      status === 1
        ? "הצעה אושרה בצהלחה"
        : status === 2
        ? "הצעה בוטלה בהצלחה"
        : "בקשה הוחזרה לבדיקה בהצלחה";
    axios
      .get(`/priceoffers/changestatus/${props.offer.id}`, {
        params: { status: status },
      })
      .then((res) => {
        toast.success(message);
        props.getData();
      })
      .catch((err) => console.log(err));
  }

  function handleDownload() {
    axios
      .get(`/priceoffers/pdf/${props.offer.id}`, { responseType: "blob" })
      .then((res) => {
        const blob = new Blob([res?.data], {
          type: "application/pdf",
        });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      })
      .catch((error) => {
        toast.error("התרחשה שגיאה, לא ניתן להוריד קובץ זה");
        console.error(error);
      });
  }

  function handleSend() {
    axios
      .get(`/priceoffers/send/${props.offer.id}`)
      .then((response) => {
        const data = response.data;
        if (data.mailto_link) {
          window.location.href = data.mailto_link;
        } else {
          alert("Failed to generate the email link.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  return (
    <div dir="rtl">
      <div className="flex relative w-full h-[85px] text-lg py-4 pl-10 gap-16  text-[rgba(120,120,120,1)] shadow-[0px_0px_9.4px_0px_rgba(0,0,0,0.1)] bg-white rounded-md">
        <div className="flex flex-1 text-center items-center">
          <div className="flex-1"> {props.offer?.offer_number}</div>
          <div className="flex-1">{props.offer?.unit?.name}</div>
          <div className="flex flex-col items-center flex-1">
            <p className="truncate">{props.offer?.client?.name} </p>
            <p className="text-[15px] -mt-1">{props.offer?.client?.phone}</p>
          </div>
          <div className="flex-1"> {props.offer?.offer_price} </div>
          <div className="flex-1">{props.offer?.created_at_date} </div>
          <div className="flex-1 flex justify-center">
            <div
              onClick={() => setStatusClicked(true)}
              className={`rounded-md font-semibold py-2 px-6 flex  items-center gap-1 relative ${
                props.offer.status === 1
                  ? "bg-[rgba(229,244,229,1)] text-[rgba(41,130,42,1)]"
                  : props.offer.status === 2
                  ? "bg-[rgba(201,45,23,0.17)] text-[rgba(201,45,23,1)]"
                  : "bg-[rgba(217,217,217,0.4)] text-[rgba(120,120,120,0.58)]"
              }`}
            >
              {props.offer.status === 1 ? (
                <CircleCheck />
              ) : props.offer.status === 2 ? (
                <CircleX />
              ) : (
                <Clock3 />
              )}
              {props.offer.status === 1
                ? "בוצע"
                : props.offer.status === 2
                ? "בוטל"
                : "בבדיקה"}
              {statusClicked && props.offer.status == 0 && (
                <ChangeStatus
                  handleResend={(status) => handleResend(status)}
                  close={() => setStatusClicked(false)}
                />
              )}
            </div>
          </div>
        </div>
        <div className="w-[200px] gap-1 flex justify-between items-center">
          <ButtonAnimation
            animation={"/mail.png"}
            icon={"/mail-icon.png"}
            onClick={handleSend}
          />
          <ButtonAnimation
            animation={"/viewAnimation.png"}
            icon={"/eye.png"}
            onClick={() => setIsOpen(2)}
          />
          <ButtonAnimation
            animation={"/pencil2.png"}
            icon={"/pencil.png"}
            onClick={() => setIsOpen(1)}
          />
          <ButtonAnimation
            animation={"/download2.png"}
            icon={"/download.png"}
            onClick={handleDownload}
          />
          {props.offer.status !== 2 ? (
            <ButtonAnimation
              animation={"/trash-open.png"}
              icon={"/trash.png"}
              size={24}
              bg={true}
              onClick={() => setIsDelete(true)}
            />
          ) : (
            <ButtonAnimation
              animation={"/resend2.png"}
              icon={"/resend.png"}
              onClick={() => handleResend(0)}
            />
          )}
        </div>
      </div>
      {isDelete && (
        <DeletePopUp
          handleDeleteProp={handleDelete}
          HandleClose={() => setIsDelete(false)}
          type={"priceOffer"}
          name={`הצעה מספר ${props.offer.offer_number}`}
        />
      )}
      {isOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.33)] z-50 w-full flex flex-col items-center justify-center">
          <div className="relative w-[80%] max-h-[85%] h-[85%] rounded-lg bg-white  flex flex-col pb-10  px-20">
            <h1 className="p-5 text-2xl font-bold text-[rgba(201,45,23,1)]  w-full text-center">
              {isOpen === 1
                ? "עריכת הצעת מחיר"
                : `הצעה מספר ${props.offer.offer_number}`}
            </h1>
            <X
              onClick={() => setIsOpen(false)}
              className="text-gray-400 absolute right-3 top-3"
            />
            <NewOffer
              offer={props.offer}
              disabled={isOpen === 2 && true}
              close={() => setIsOpen(false)}
              getData={() => props.getData()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
