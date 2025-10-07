import React, { useState, useEffect, useRef } from "react";
import { format, addMonths, subMonths, addYears, subYears } from "date-fns";
import he from "date-fns/locale/he";
import { CalendarDays } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HebrewCalendar(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  const calendarRef = useRef(null);

  const minDate = new Date(props.min);

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextYear = () => {
    setCurrentMonth(addYears(currentMonth, 1));
  };

  const prevYear = () => {
    setCurrentMonth(subYears(currentMonth, 1));
  };

  function handleClick(i, isPrevMonth, isNextMonth) {
    if (isPrevMonth) {
      prevMonth();
      return;
    } else if (isNextMonth) {
      nextMonth();
      return;
    }
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const day = String(i).padStart(2, "0");
    const selectedDate = new Date(`${year}-${month}-${day}`);

    if (selectedDate < minDate) {
      toast.error("תאריך סיום חייב להיות עתידי לתאריך ההתחלה");
      // setInputDate(props.min);
      props.setData(props.min);
    } else {
      // setInputDate(`${year}-${month}-${day}`);
      props.setData(`${year}-${month}-${day}`);
    }
    setIsOpen(false);
  }

  function Style(i, isOtherMonth) {
    const dateArr = props.date.split("-");
    const day = String(i).padStart(2, "0");
    const year = String(currentMonth.getFullYear());
    const month = String(
      currentMonth.getMonth() + (isOtherMonth && i <= 7 ? 2 : 1)
    ).padStart(2, "0");

    if (dateArr[0] === year && dateArr[1] === month && dateArr[2] === day) {
      return "bg-[rgba(201,45,23,1)] text-white";
    } else if (
      year === String(today.getFullYear()) &&
      month === String(today.getMonth() + 1).padStart(2, "0") &&
      day === String(today.getDate()).padStart(2, "0")
    ) {
      return "border border-[rgba(201,45,23,1)] text-[rgba(201,45,23,1)]";
    } else if (isOtherMonth) {
      return "bg-white text-[rgba(77,77,77,0.44)]";
    } else {
      return "bg-white hover:bg-[rgba(201,45,23,1)] hover:text-white";
    }
  }

  const monthName = format(currentMonth, "LLLL", { locale: he });
  const year = format(currentMonth, "yyyy", { locale: he });
  const weekdays = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );
    const firstDayOfWeek = firstDayOfMonth.getDay();

    const previousMonthLastDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      0
    ).getDate();
    const days = [];

    // Add days from the previous month
    for (let i = firstDayOfWeek; i > 0; i--) {
      days.push(
        <button
          type="button"
          onClick={() => handleClick(previousMonthLastDay - i + 1, true)}
          key={`prev-${i}`}
          className={`w-12 h-12 mr-1 rounded-md text-center ${Style(
            previousMonthLastDay - i + 1,
            true
          )}`}
        >
          {previousMonthLastDay - i + 1}
        </button>
      );
    }

    // Add days of the current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(
        <button
          type="button"
          onClick={() => handleClick(i, false)}
          key={i}
          className={`w-12 h-12 mr-1 rounded-md text-center ${Style(i, false)}`}
        >
          {i}
        </button>
      );
    }

    // Add days from the next month
    const totalDays = firstDayOfWeek + lastDayOfMonth.getDate();
    const remainingCells = 7 - (totalDays % 7);
    for (let i = 1; i <= remainingCells && remainingCells < 7; i++) {
      days.push(
        <button
          type="button"
          onClick={() => handleClick(i, false, true)}
          key={`next-${i}`}
          className={`w-12 h-12 mr-1 rounded-md text-center hover:bg-[rgba(201,45,23,1)] hover:text-white ${Style(
            i,
            true
          )}`}
        >
          {i}
        </button>
      );
    }

    return days;
  };

  // Detect clicks outside the calendar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <label className="relative w-full">
        <div className="flex relative text-right items-center w-full border shadow-[0px_0px_5.8px_0px_rgba(0,0,0,0.15)] justify-between rounded-md py-1.5 p-1">
          <input
            className="date focus:outline-none bg-white"
            type="date"
            id="inputDate"
            name="inputDate"
            value={props.date}
            disabled={true}
          />
          <CalendarDays
            onClick={() => setIsOpen(true)}
            className="text-mediumRed ml-2"
          />
        </div>
        {isOpen && (
          <div
            ref={calendarRef}
            className="flex flex-col absolute w-[400px] z-50 top-[110%] left-2 items-center bg-[rgba(244,244,244,1)] p-5 rounded-md"
          >
            <div className="flex gap-2 text-lg w-full text-mediumRed">
              <div className="bg-white text-center flex items-center px-2 py-1 rounded-md gap-5">
                <button type="button" onClick={prevMonth}>
                  &lt;
                </button>
                <div>{monthName}</div>
                <button type="button" onClick={nextMonth}>
                  &gt;
                </button>
              </div>
              <div className="bg-white text-center flex px-2 py-1 rounded-md gap-5">
                <button type="button" onClick={prevYear}>
                  &lt;
                </button>
                <div>{year}</div>
                <button type="button" onClick={nextYear}>
                  &gt;
                </button>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-7 gap-2">
                {weekdays.map((day, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-md text-center text-[rgba(201,45,23,1)] font-semibold"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays()}
              </div>
            </div>
          </div>
        )}
      </label>
    </>
  );
}

export default HebrewCalendar;
