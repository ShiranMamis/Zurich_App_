import React, { useEffect, useState } from "react";

export default function Input(props) {
  const [isValid, setIsValid] = useState(false);
  const [validationText, setValidationText] = useState("שדה זה הוא חובה");
  function handleInvalid(event) {
    event.preventDefault();
    setIsValid(true);
    {
      if (!event.target.value && props.required) {
        setValidationText("שדה זה הוא חובה");
      } else {
        if (event.target.pattern === "^[0-9]*$") {
          setValidationText("שדה זה מכיל מספרים בלבד");
        } else if (event.target.pattern === "[0-9]{7}") {
          setValidationText("שדה זה חייב להכיל שבע ספרות");
        } else if (event.target.pattern === "[0]{1}[5]{1}[0-9]{8}") {
          setValidationText("שדה זה צריך להתאים לפורמט המבוקש '05XXXXXXXX'");
        } else if (
          event.target.minLength === 2 &&
          event.target.value.length < 2
        ) {
          setValidationText("שדה זה חייב להכיל לפחות 2 תווים");
        } else if (event.target.value) {
          setValidationText("שדה זה אינו תקין");
        }
      }
    }
  }

  function handleChange(event) {
    if (event.target.name !== null) {
      setIsValid((prevIsValid) => false);
    }
    if (!event.target.value) {
      setIsValid(true);
      setValidationText("שדה זה הוא חובה");
    }
    if (props.handleChange) props.handleChange(event);
  }

  return (
    <div
      className={`flex flex-col gap-1 w-full ${
        !isValid && props.required ? "mb-0" : "mb-0"
      }`}
    >
      {props.title && (
        <span className="text-[rgba(201,45,23,1)] text-lg font-bold">
          {props.placeholder}
        </span>
      )}
      <input
        className={`flex w-full h-full bg-[rgba(217,217,217,0.4)] rounded-md pr-2.5 py-2 focus:outline-none ${
          isValid && !props.disabled && " border border-[rgba(201,45,23,1)]"
        } `}
        type={props.type ? props.type : "text"}
        name={props.name}
        autoComplete="off"
        onInvalid={handleInvalid}
        placeholder={props.placeholder}
        onChange={handleChange}
        pattern={props.pattern}
        required={props.required}
        min={1}
        minLength="2"
        maxLength={props.maxLength}
        value={props.value}
        disabled={props.disabled}
      />
      <span
        className={`${
          (!isValid || props.disabled) && "hidden"
        } text-center text-sm font-semibold ${
          isValid && !props.disabled && "block text-[rgba(201,45,23,1)]"
        }`}
      >
        {" "}
        {validationText}
      </span>
    </div>
  );
}
