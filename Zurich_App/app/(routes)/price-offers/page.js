"use client";

import PagesFooter from "@/app/components/PagesFooter";
import PriceOffer from "@/app/components/PriceOffer";
import useAuth from "@/app/hooks/useAuth";
import axios from "@/app/lib/axios";
import { CirclePlus, Frown, Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

export default function page() {
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(0);
  const { user } = useAuth({ middleware: "guest" });

  function calculateVisibleDivs(divHeight) {
    const viewportHeight = window.innerHeight;
    const componentHeight = viewportHeight * 0.7;
    const visibleDivs = Math.floor(componentHeight / divHeight);
    return visibleDivs;
  }

  function getData(page) {
    let count = calculateVisibleDivs(85);
    axios
      .get(`/priceoffers/all?page=${page ? page : currentPage}`, {
        params: { count },
      })
      .then((res) => {
        let data = res.data.data.data;
        data = data.map((offer) => {
          let items = offer?.items;
          items = items?.map((item) => {
            return {
              id: item.id,
              product_name: item.product?.id,
              sku: item.product?.sku,
              quantity: item.quantity,
              price: item.product?.sale_price,
              sale: item.sale,
              sum_price: item.price,
              is_deleted: 0,
            };
          });
          return { ...offer, items: items };
        });
        setData(data);
        setPages(res.data.data.last_page);
        if (res.data.data.last_page < currentPage) {
          setCurrentPage(res.data.data.last_page);
          getData(res.data.data.last_page);
        }
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
    return <p>לא קיימת לך הרשאה לעמוד זה</p>;
  }

  function handleSearch(e, page) {
    setValue(e.target.value);
    if (e.target.value == "") {
      getData();
      return;
    }
    axios
      .get(`priceoffers/search?page=${page ? page : currentPage}`, {
        params: { query: e.target.value, count: calculateVisibleDivs(85) },
      })
      .then((res) => {
        let data = res.data.data.data;
        data = data.map((offer) => {
          let items = offer?.items;
          items = items?.map((item) => {
            return {
              id: item.id,
              product_name: item.product?.id,
              sku: item.product?.sku,
              quantity: item.quantity,
              price: item.product?.sale_price,
              sale: item.sale,
              sum_price: item.price,
              is_deleted: 0,
            };
          });
          return { ...offer, items: items };
        });
        setData(data);
        setPages(res.data.data.last_page);
      })
      .catch((err) => console.log(err));
  }
  return (
    <div className="flex flex-col h-full items-center">
      <div className="py-4 w-full text-center p-3 shadow-[-6px_3px_10.6px_0px_rgba(0,0,0,0.1)] text-2xl bg-white text-[rgba(201,45,23,1)] font-bold">
        הצעות מחיר
      </div>
      <div className="flex w-full mt-6 gap-3 justify-center items-center">
        <Link
          href={"/form"}
          className="text-[rgba(201,45,23,1)] text-lg font-medium flex items-center gap-1"
        >
          <CirclePlus />
          צור הצעה
        </Link>
        <div className="w-3/5 text-lg px-2 flex items-center bg-[rgba(236,236,236,1)] rounded-lg ">
          <input
            type="search"
            value={value}
            onChange={(e) => {
              setCurrentPage(1);
              handleSearch(e, (page = 1));
            }}
            placeholder="חיפוש"
            className="p-2 flex-1 focus:outline-none bg-transparent"
          />
          <Search className="ml-2 text-gray-400" />
        </div>
      </div>
      <div className="flex flex-col w-[92%] px-[2%] h-[80vh] overflow-y-auto pt-5 gap-1.5">
        <div className="flex w-full text-xl text-center font-semibold gap-16 pl-10 bg-[rgba(201,45,23,1)] text-white rounded-md p-1">
          <div className="flex flex-1">
            <div className="flex-1">מספר הצעה</div>
            <div className="flex-1">יחידה</div>
            <div className="flex-1"> פרטי קשר</div>
            <div className="flex-1">מחיר </div>
            <div className="flex-1">תאריך </div>
            <div className="flex-1">סטטוס </div>
          </div>
          <div className="w-[200px]"></div>
        </div>
        {data?.length === 0 && isLoading && (
          <Skeleton count={calculateVisibleDivs(85)} height={85} />
        )}
        {data?.map((item) => {
          return (
            <PriceOffer
              offer={item}
              key={item.offer_number}
              getData={() => getData()}
            />
          );
        })}
        {data.length === 0 && !isLoading && (
          <div className="w-full text-3xl h-full justify-center items-center flex flex-col text-gray-400">
            <Frown className="w-16 h-16" />
            <p className="text-2xl font-semibold">שגיאה 404</p>
            <p className="text-lg ">
              {value
                ? "הצעת מחיר שחיפשת לא קיימת במערכת"
                : "לא קיימות הצעות מחיר במערכת"}
            </p>
          </div>
        )}
      </div>
      <footer className=" w-full py-6 flex justify-center">
        {pages > 1 && (
          <PagesFooter
            pages={pages}
            currentPage={currentPage}
            setCurrentPage={(page) => {
              setCurrentPage(page);
              if (value) {
                handleSearch({ target: { value } }, page);
              } else getData(page);
            }}
          />
        )}
      </footer>
    </div>
  );
}
