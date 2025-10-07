import React from "react";

export default function NumberInput(props) {
  const handleKeyDown = (e) => {
    // רשימת התווים המותרים
    const allowedKeys = [
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "Tab",
      "Delete",
    ];

    if (allowedKeys.includes(e.key)) {
      return;
    }

    // מונע הקלדת כל תו שאינו מספר
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <>
      <input
        className={
          props.style
            ? props.style
            : "text-right h-full pr-1 rounded-md bg-white border border-gray-300 ml-1"
        }
        type="number"
        min={0}
        max={props.name === "quantity" ? 1000 : 100}
        name={props.name}
        value={props.value}
        onChange={(e) => {
          props.handleChange(e);
        }}
        onKeyDown={handleKeyDown}
      />
    </>
  );
}
