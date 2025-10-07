import React, { useEffect, useState, useRef } from "react";
import ButtonAnimation from "../ButtonAnimation";
import DeletePopUp from "../global/DeletePopUp";
import { CircleCheck, CircleX, HelpCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "@/app/lib/axios";

export default function FixedProducts({
  data = [],
  isAddProduct,
  getData,
  row,
  index,
}) {
  const [formDetails, setFormDetails] = useState([]);
  const [popup, setPopUp] = useState(false);
  const [isEditing, setIsEditing] = useState(true); // chang to false
  const [isDisabled, setIsDisabled] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [statusClicked, setStatusClicked] = useState(false);
  const [typeStatus, SetTypeStatus] = useState(String(row.status));
  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState("");
  const statusRef = useRef(null);
  const containerRef = useRef(null);
  const [editData, setEditData] = useState([]);

  useEffect(() => {
    // Update formDetails whenever data changes
    const products = data.map((product) => ({
      id: product.id,
      mkat: product.mkat,
      ProductDescription: product.ProductDescription,
      costPercentages: product.costPercentages,
      CommissionPercentages: product.CommissionPercentages,
      salePrice: product.salePrice,
      status: product.status,
    }));
    setFormDetails(products);
  }, [data]);

  const calculateSalePrice = (costPrice, comission) => {
    const cost = parseFloat(costPrice) || 0;
    const comissionPercentage = parseFloat(comission) || 0;
    const salePrice = cost + cost * (comissionPercentage / 100);
    return parseFloat(salePrice.toFixed(2)); // Formats to 2 decimal places and converts back to a number
  };
  useEffect(() => {
    // Sync formValues with editData changes
    setEditData(
      data.map((row) => ({
        mkatV: row.sku,
        describeV: row.describe,
        costPriceV: row.cost_price,
        comissionV: row.comission,
        salePriceV: row.sale_price,
        status: typeStatus,
      }))
    );
  }, [formDetails, typeStatus]);

  const handleInputChangeEdit = (e, index) => {
    const { name, value } = e.target;
    setEditData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedData[index], [name]: value };

      if (name === "costPriceV" || name === "comissionV") {
        const costPriceV = parseFloat(updatedData[index].costPriceV) || 0;
        const comissionV = parseFloat(updatedData[index].comissionV) || 0;
        updatedData[index] = {
          ...updatedData[index],
          salePriceV: calculateSalePrice(costPriceV, comissionV),
        };
      }
      console.log(updatedData);
      return updatedData;
    });
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  //status-click
  function handelStatusClick(e, row) {
    e.preventDefault();
    console.log("is clicked");
    console.log(row?.status);
    setStatusClicked(true);
  }
  const handleClickStatus = async (status) => {
    console.log("Status clicked:", status);
    SetTypeStatus(status);
    setEditData((prevState) => ({
      ...prevState,
      status: status,
    }));
    await getData();
    setStatusClicked(false); // Or handle status as needed
  };
  const handleClickOutside = (event) => {
    if (
      statusRef.current &&
      !statusRef.current.contains(event.target) &&
      containerRef.current &&
      !containerRef.current.contains(event.target)
    ) {
      setStatusClicked(false);
    }
  };

  // delete
  async function handleDelete(id) {
    try {
      console.log("The id that shows in the delete popup " + id);
      await axios.delete(`products/${id}`);
      await getData();
      setIsEditing(false);
      setIsDisabled(false);
      notifyMessage("delete");
    } catch (err) {
      console.error(err);
      errorNofify();
    }
  }
  function handleClose() {
    setProductName("");
    setProductId("");
    popup.delete && setPopUp((prev) => ({ ...prev, delete: false }));
  }
  function handleOpen(e) {
    console.log("opend");
    setProductName(e.currentTarget.name);
    setProductId(e.currentTarget.id);
    e.currentTarget.value === "delete" &&
      setPopUp((prev) => ({ ...prev, delete: true }));
  }

  // Notify Message
  const notifyMessage = (type) => {
    const messages = {
      delete: "מחיקה התבצעה בהצלחה",
      edit: "עריכה התבצעה בהצלחה",
      exist: "מוצר זה כבר קיים במערכת עם אותו מקט",
      no_changes: "לא התבצע שינוי",
    };
    toast.success(messages[type] || "פעולה הושלמה", {
      position: "bottom-right",
    });
  };
  const errorNofify = () => {
    toast.error("קרתה שגיאה בעת ביצוע הפעולה, אנא נסה שוב מאוחר יותר", {
      position: "bottom-right",
    });
  };

  // Edit
  const handleEditClick = (index) => {
    setEditIndex(index);
    setIsEditing(true);
    setIsDisabled(false);
  };
  async function handleEdit(e, id) {
    e.preventDefault();

    // קבלת המידע שהוזן ע"י המשתמש לעדכון
    const editedItem = editData[editIndex];
    const originalItem = formDetails[editIndex];
    const updatedFields = {};

    // השוואת הערכים בין המידע החדש לישן ועדכון השדות ששונו
    for (const key in editedItem) {
      if (editedItem[key] !== originalItem[key]) {
        switch (key) {
          case "mkatV":
            updatedFields.sku = editedItem[key];
            break;
          case "describeV":
            updatedFields.describe = editedItem[key];
            break;
          case "costPriceV":
            updatedFields.cost_price = editedItem[key];
            break;
          case "comissionV":
            updatedFields.comission = editedItem[key];
            break;
          case "salePriceV":
            updatedFields.sale_price = editedItem[key];
            break;
          case "status":
            updatedFields.status = editedItem[key];
            break;
          default:
            break;
        }
      }
    }
    console.log(editData[index]?.status);
    // אם יש שדות ששונו, שלח את הבקשה לשרת
    if (Object.keys(updatedFields).length > 0) {
      try {
        console.log(updatedFields);
        console.log("Sending update request with data:", updatedFields);
        await axios.put(`products/${id}`, updatedFields); // שליחה לשרת עם מזהה העריכה והנתונים המעודכנים
        await getData(); // טעינת נתונים חדשים
        notifyMessage("edit"); // הצגת הודעת הצלחה
        setIsEditing(false);
        setEditIndex(null);
      } catch (error) {
        console.error("Error updating item:", error);
        errorNofify(); // הצגת הודעת שגיאה
      }
    } else {
      // אם אין שדות ששונו, לא לשלוח בקשה לשרת
      setIsEditing(false);
      setEditIndex(null);
      notifyMessage("no_changes"); // הצגת הודעה על כך שלא התבצע שינוי
    }
  }

  console.log(editData[index]);

  return (
    <>
      <div key={row.id} className="flex items-center ">
        <div className="flex z-50 items-center absolute mr-[67%]">
          {statusClicked && (
            <div
              ref={statusRef}
              className="bg-white z-50 p-2 rounded-md shadow-[0px_0px_9.4px_0px_rgba(0,0,0,0.1)] w-[134px] bottom-50 h-[99px] "
            >
              <button
                onClick={() => handleClickStatus("1")}
                className="bg-[rgba(229,244,229,1)] mb-1 text-[rgba(41,130,42,1)] rounded-md justify-center font-semibold py-2 w-full flex items-center gap-1"
              >
                <CircleCheck /> יש מלאי
              </button>
              <button
                onClick={() => handleClickStatus("0")}
                className="bg-[rgba(201,45,23,0.17)] text-[rgba(201,45,23,1)] rounded-md font-semibold justify-center py-2 w-full flex items-center gap-1"
              >
                <CircleX /> אין מלאי
              </button>
            </div>
          )}
        </div>
        <div
          className={`rounded-xl h-[80px] w-full shadow-sm items-center justify-start cursor-pointer bg-[#FFFFFF] grid grid-cols-8 gap-1`}
        >
          <div className="flex col-span-1 px-3 justify-center items-center ">
            <h1 className="justify-center gap-2 rounded-xl flex w-full h-[40px]">
              <input
                className={`focus:bg-[#ecebeb] focus:border-0 focus:outline-none w-full text-center ml-3 text-[18px] bg-[#FFFFFF] border-0 text-[#787878] rounded-md
                                ${
                                  isDisabled
                                    ? "border-0 bg-transparent  bg-orange-100"
                                    : ""
                                }
                                ${
                                  editIndex === index
                                    ? "border-2 border-[#d4d4d4] bg-[#f5f5f5]"
                                    : "bg-[#FFFFFF]"
                                }`}
                onChange={(e) => handleInputChangeEdit(e, index)}
                value={editData[index]?.mkatV}
                disabled={editIndex !== index} // מצב עריכה
                name="mkatV"
                defaultValue={row.sku}
              />
            </h1>
          </div>
          <div className="flex col-span-2 justify-center items-center">
            <h1 className="justify-center gap-2 rounded-xl flex w-full h-[42px]">
              <input
                className={`focus:bg-[#ecebeb] focus:border-0 focus:outline-none w-full text-center ml-3 text-[18px] bg-[#FFFFFF] border-0 text-[#787878] rounded-md
                                ${
                                  isDisabled
                                    ? "border-0 bg-transparent  bg-orange-100"
                                    : ""
                                }
                                ${
                                  editIndex === index
                                    ? "border-2 border-[#d4d4d4] bg-[#f5f5f5]"
                                    : "bg-[#FFFFFF]"
                                }`}
                value={editData[index]?.describeV}
                onChange={(e) => handleInputChangeEdit(e, index)}
                disabled={editIndex !== index} // מצב עריכה
                name="describeV"
                defaultValue={row.describe}
              />
            </h1>
          </div>
          <div className="flex col-span-1 px-3 justify-center items-center">
            <input
              className={`focus:bg-[#ecebeb] focus:border-0 focus:outline-none w-full text-center ml-3 text-[18px] bg-[#FFFFFF] border-0 text-[#787878] rounded-md
                            ${
                              isDisabled
                                ? "border-0 bg-transparent  bg-orange-100"
                                : ""
                            }
                            ${
                              editIndex === index
                                ? "border-2 border-[#d4d4d4] bg-[#f5f5f5]"
                                : "bg-[#FFFFFF]"
                            }`}
              value={editData[index]?.costPriceV}
              onChange={(e) => handleInputChangeEdit(e, index)}
              type="number"
              step="0.01"
              name="costPriceV"
              disabled={editIndex !== index} // מצב עריכה
              defaultValue={row.cost_price}
            />
          </div>
          <div className="flex col-span-1 px-3 justify-center items-center">
            <input
              className={`focus:bg-[#ecebeb] focus:border-0 focus:outline-none w-full text-center ml-3 text-[18px] bg-[#FFFFFF] border-0 text-[#787878] rounded-md
                            ${
                              isDisabled
                                ? "border-0 bg-transparent  bg-orange-100"
                                : ""
                            }
                            ${
                              editIndex === index
                                ? "border-2 border-[#d4d4d4] bg-[#f5f5f5]"
                                : "bg-[#FFFFFF]"
                            }`}
              value={editData[index]?.comissionV}
              onChange={(e) => handleInputChangeEdit(e, index)}
              type="number"
              step="0.01"
              name="comissionV"
              disabled={editIndex !== index} // מצב עריכה
              defaultValue={row.comission}
            />
          </div>
          <div className="flex col-span-1 px-3 justify-center items-center">
            <input
              className={`focus:bg-[#ecebeb] focus:border-0 focus:outline-none w-full text-center ml-3 text-[18px] bg-[#FFFFFF] border-0 text-[#787878] rounded-md
                            ${
                              isDisabled
                                ? "border-0 bg-transparent  bg-orange-100"
                                : ""
                            }
                            ${
                              editIndex === index
                                ? "border-2 border-[#d4d4d4] bg-[#f5f5f5]"
                                : "bg-[#FFFFFF]"
                            }`}
              value={editData[index]?.salePriceV}
              disabled={true}
              type="number"
              step="0.01"
              name="salePriceV"
              defaultValue={row.sale_price}
            />
          </div>
          <div
            ref={containerRef}
            className="relative flex col-span-1 px-3 justify-center items-center "
          >
            <button
              defaultValue={row.status}
              value={editData[index]?.status}
              className="flex col-span-1 px-3 justify-center items-center "
              disabled={editIndex !== index}
              onClick={(e) => handelStatusClick(e, row)}
            >
              {!typeStatus || !row.status ? (
                <div className="bg-[#FAEDEB] items-center justify-center gap-2 rounded-xl flex w-[134px] h-[42px]">
                  <CircleX className="text-[#C92D17] h-[15px] w-[15px]" />
                  <h1 className="text-[#C92D17] text-[20px]">אין מלאי</h1>
                </div>
              ) : (
                <div className="bg-[#E5F4E5] items-center justify-center gap-2 rounded-xl flex w-[134px] h-[42px]">
                  <CircleCheck className="text-[#29822A] h-[15px] w-[15px]" />
                  <h1 className="text-[#29822A] text-[20px]">יש מלאי</h1>
                </div>
              )}
            </button>
          </div>
          <div className="flex col-span-1 px-3 gap-6 justify-center items-center ">
            {editIndex === index ? (
              <button
                ref={statusRef}
                className="bg-[rgba(62,175,63,0.21)] p-2 rounded-md"
                onClick={(e) => handleEdit(e, row.id)}
              >
                <Image src={"/Frame.png"} width={25} height={25} />
              </button>
            ) : (
              <button onClick={() => handleEditClick(index)}>
                <ButtonAnimation
                  animation={"/pencil2.png"}
                  icon={"/pencil.png"}
                />
              </button>
            )}
            <button
              id={row.id}
              onClick={(e) => handleOpen(e)}
              name={row.describe}
              value="delete"
            >
              <ButtonAnimation
                animation={"/trash-open.png"}
                icon={"/trash.png"}
                size={24}
              />
            </button>
          </div>
        </div>
      </div>
      {popup.delete && (
        <DeletePopUp
          HandleClose={handleClose}
          type={"product"}
          name={productName}
          handleDeleteProp={() => handleDelete(productId)}
        />
      )}
    </>
  );
}
