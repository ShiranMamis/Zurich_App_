import { CircleCheck, CircleX } from "lucide-react";
import React, { useEffect, useRef } from "react";

export default function ChangeStatus(props) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        props.close(); // This function will be called when clicking outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div
      ref={wrapperRef}
      className="bg-white absolute z-50 p-2 rounded-md shadow-[0px_0px_9.4px_0px_rgba(0,0,0,0.1)] -top-[55%] w-full right-0"
    >
      <button
        onClick={() => props.handleResend(1)}
        className="bg-[rgba(229,244,229,1)] mb-1 text-[rgba(41,130,42,1)] rounded-md justify-center font-semibold py-2 w-full flex items-center gap-1"
      >
        בוצע <CircleCheck />
      </button>
      <button
        onClick={() => props.handleResend(2)}
        className="bg-[rgba(201,45,23,0.17)] text-[rgba(201,45,23,1)] rounded-md font-semibold justify-center py-2 w-full flex items-center gap-1"
      >
        בוטל <CircleX />
      </button>
    </div>
  );
}
