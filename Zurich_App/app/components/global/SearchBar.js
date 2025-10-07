"use client";
import React, { useEffect, useState } from 'react'
import { CirclePlus, Search } from 'lucide-react';
import Link from 'next/link';

export default function SearchBar({ searchType, data, handleClickProp }) {
    const [isClicked, setIsClicked] = useState(false);

    // useEffect(() => {
    //     setIsClicked(!isClicked);
    //     console.log(isClicked);
    // })
    // useEffect(() => {
    //     setIsClicked(!isClicked);
    //     console.log(isClicked);
    // })

    return (
        <div className="flex flex-col gap-1 items-center">
            <div className="flex justify-center mt-10 mb-10 gap-10">
                <div className="flex ">
                    <button onClick={handleClickProp} className="flex items-center gap-2">
                        <CirclePlus className="items-center text-[#C92D17] h-[22px] w-[22px]" />
                        <div className="flex justify-center items-center text-[#C92D17] text-[22px] ">{searchType}</div>
                    </button>
                </div>
                <div className="flex items-center justify-between h-[42px] w-[1053px] p-2 border rounded-md bg-[#ECECEC] border-dark_text ">
                    <input
                        autoComplete="off"
                        placeholder="חיפוש"
                        type="search"
                        className="focus:outline-none text-[22px] w-[1053px] bg-[#ECECEC]"
                    />
                    <button>
                        <Search className=" text-gray-500 h-[22px] w-[22px]" />
                    </button>
                </div>
            </div>
        </div>
        // <div className="flex w-full mt-6 gap-3 justify-center items-center">
        //     <button className="text-[rgba(201,45,23,1)] flex gap-2 justify-center items-center text-[#C92D17] text-[28px] " >
        //         <CirclePlus />
        //         {searchType}
        //     </button>
        //     <div className="w-3/5 text-lg px-2 flex items-center bg-[rgba(236,236,236,1)] rounded-lg ">
        //         <input
        //             type="search"
        //             placeholder="חיפוש"
        //             className="p-2 flex-1 focus:outline-none bg-transparent"
        //         />
        //         <Search className="ml-2 text-gray-400" />
        //     </div>
        // </div>
    )
}
