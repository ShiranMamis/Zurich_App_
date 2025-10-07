import React from "react";

export default function PagesFooter(props) {
  function getArray() {
    let array = [];
    if (props.pages < 5) array = [...Array(props.pages)].map((_, i) => i + 1);
    else if (props.currentPage < 3) array = [...Array(5)].map((_, i) => i + 1);
    else if (props.pages > props.currentPage + 2)
      array = [
        props.currentPage - 2,
        props.currentPage - 1,
        props.currentPage,
        props.currentPage + 1,
        props.currentPage + 2,
      ];
    else
      array = [
        props.pages - 4,
        props.pages - 3,
        props.pages - 2,
        props.pages - 1,
        props.pages,
      ];
    return array;
  }
  const array = getArray();
  return (
    <div className="h-full flex gap-4 text-xl">
      <button
        className="text-[rgba(201,45,23,1)]"
        onClick={() => {
          if (props.pages > props.currentPage)
            props.setCurrentPage(props.currentPage + 1);
        }}
      >
        עמוד הבא
      </button>
      <div dir="ltr" className="flex gap-1">
        {array?.map((i) => {
          return (
            <button
              key={i}
              className={`text-[rgba(120,120,120,1)] py-3 px-5 rounded-md ${
                props.currentPage === i && "text-white bg-[rgba(201,45,23,1)]"
              }`}
              onClick={() => props.setCurrentPage(i)}
            >
              {i}
            </button>
          );
        })}
      </div>
      <button
        className="text-[rgba(201,45,23,1)]"
        onClick={() => {
          if (props.currentPage > 1)
            props.setCurrentPage(props.currentPage - 1);
        }}
      >
        עמוד קודם
      </button>
    </div>
  );
}
