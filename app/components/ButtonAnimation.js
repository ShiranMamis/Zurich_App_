import Image from "next/image";
import React, { useState } from "react";

export default function ButtonAnimation(props) {
  const [isHover, setIsHover] = useState(false);
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`${props.bg && "bg-[rgba(201,45,23,0.17)]"}  p-1 rounded-md `}
      // className="bg-[rgba(201,45,23,0.17)] flex-1 h-3/4 p-1 rounded-md"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {isHover ? (
        <Image
          src={props.animation}
          alt="delete"
          width={props.size ? props.size : 22}
          height={props.size ? props.size : 22}
        />
      ) : (
        <Image
          src={props.icon}
          alt="delete"
          width={props.size ? props.size : 22}
          height={props.size ? props.size : 22}
        />
      )}
    </button>
  );
}
