"use client";
import PagesFooter from "@/app/components/PagesFooter";
import VatForm from "@/app/components/VatForm";
import VatRow from "@/app/components/VatRow";
import useAuth from "@/app/hooks/useAuth";
import axios from "@/app/lib/axios";
import { CirclePlus, Frown, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-toastify/dist/ReactToastify.css";

export default function page() {
  const [data, setData] = useState([]);
  const [addRow, setAddRow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState("");
  const { user } = useAuth({ middleware: "guest" });

  function calculateVisibleDivs(divHeight) {
    const viewportHeight = window.innerHeight;
    const componentHeight = viewportHeight * 0.7;
    const visibleDivs = Math.floor(componentHeight / divHeight);

    return visibleDivs;
  }
  function getData(page) {
    let count = calculateVisibleDivs(60);
    axios
      .get(`/vats/all?page=${page ? page : currentPage}`, { params: { count } })
      .then((res) => {
        setData(res.data.data.data);
        setPages(res.data.data.last_page);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }
  useEffect(() => {
    if (data.length === 0) {
      getData();
    }
  }, []);

  if (!user) {
    return (
      <div className="text-center w-full h-full">
        לא קיימת לך הרשאה לעמוד זה
      </div>
    );
  }

  function handleSearch(e, page) {
    setValue(e.target.value);
    if (e.target.value === "") {
      getData();
      return;
    }
    axios
      .get(`/vats/search?page=${page ? page : currentPage}`, {
        params: { query: e.target.value, count: calculateVisibleDivs(60) },
      })
      .then((res) => {
        setData(res.data.data.data);
      })
      .catch((err) => console.log(err));
  }
  return (
    <div className="flex flex-col w-full h-full items-center">
      <div className="py-4 w-full text-center p-3 shadow-[-6px_3px_10.6px_0px_rgba(0,0,0,0.1)] text-2xl bg-white text-[rgba(201,45,23,1)] font-bold">
        מע"מ
      </div>
      <div className="flex w-full justify-center items-center gap-3">
        <button
          onClick={() => setAddRow(true)}
          className="text-[rgba(201,45,23,1)] mt-4 text-lg font-medium flex items-center gap-1"
        >
          <CirclePlus />
          הוסף אחוז מע"מ
        </button>
        <div className="w-3/5 mt-6 text-lg px-2 flex items-center bg-[rgba(236,236,236,1)] rounded-lg ">
          <input
            type="search"
            value={value}
            onChange={handleSearch}
            placeholder="חיפוש"
            className="p-2 flex-1 focus:outline-none bg-transparent"
          />
          <Search className="ml-2 text-gray-400" />
        </div>
      </div>
      <div className="flex flex-col w-[92%] px-[2%] h-[80vh] overflow-y-auto mt-5 gap-1.5">
        <div className="flex w-full text-xl text-right pr-14 font-semibold gap-16 pl-10 bg-[rgba(201,45,23,1)] text-white rounded-md p-1">
          <div className="flex flex-1">
            <div className="w-[120px]">מס</div>
            <div className="flex-1">תאריך התחלה</div>
            <div className="flex-1"> תאריך סיום </div>
            <div className="flex-1">אחוז מע"מ </div>
          </div>
          <div className="w-[200px]"></div>
        </div>
        {data.length === 0 && isLoading && (
          <Skeleton count={calculateVisibleDivs(56)} height={56} />
        )}
        {data.length === 0 && !addRow && !isLoading && (
          <div className="w-full text-3xl h-full justify-center items-center flex flex-col text-gray-400">
            <Frown className="w-16 h-16" />
            <p className="text-2xl font-semibold">שגיאה 404</p>
            <p className="text-lg ">המוצר שחיפשת לא קיים במערכת</p>
          </div>
        )}
        {addRow && !value && (
          <VatForm
            closeForm={() => setAddRow(false)}
            index={(currentPage - 1) * 12 + 1}
            getData={() => getData()}
          />
        )}
        {data?.map((item, index) => {
          return (
            <VatRow
              row={item}
              key={item.id}
              getData={() => getData()}
              index={
                addRow
                  ? (currentPage - 1) * 12 + index + 2
                  : (currentPage - 1) * 12 + index + 1
              }
            />
          );
        })}
      </div>
      <footer className=" w-full py-6 flex justify-center">
        {pages > 1 && (
          <PagesFooter
            pages={pages}
            currentPage={currentPage}
            setCurrentPage={(page) => {
              setCurrentPage(page);
              if (value) handleSearch({ target: { value } }, page);
              else getData(page);
            }}
          />
        )}
      </footer>
    </div>
  );
}
