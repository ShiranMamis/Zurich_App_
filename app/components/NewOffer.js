import Input from "@/app/components/Input";
import SelectBySearch from "@/app/components/SelectBySearch";
import React, { useEffect, useState } from "react";
import FormItem from "./FormItem";
import { CirclePlus } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NumberInput from "./NumberInput";

export default function NewOffer(props) {
  const [units, setUnits] = useState([]);
  const [vat, setVat] = useState(null);
  const [updateData, setUpdateData] = useState({
    items: props.offer?.items ? props.offer.items : [],
  });
  console.log(updateData);
  const [data, setData] = useState({
    unit: props.offer?.unit?.id,
    name: props.offer?.client?.name,
    phone: props.offer?.client?.phone,
    comment: props.offer?.comment,
    is_mail: false,
    sale: props.offer?.sale ? props.offer?.sale : 0,
    products: props.offer?.items
      ? props.offer.items
      : [
          {
            product_name: "",
            sku: "",
            quantity: 1,
            price: 0,
            sale: 0,
            sum_price: 0,
          },
        ],
  });
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/units")
      .then((res) => {
        let arr = res.data.data;
        arr = arr?.map((unit) => {
          return { label: unit.name, value: unit.id };
        });
        setUnits(arr);
      })
      .catch((err) => console.log(err));
    axios.get("/vats/gettodayvat").then((res) => {
      setVat(res.data.data.vat);
    });
  }, []);

  function handleChange(e) {
    if (props.offer) {
      setUpdateData((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
      });
    }
    setData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  function handleChangeProducts(index, newItem) {
    if (props.offer) {
      setUpdateData((prev) => ({
        ...prev,
        items: prev.items.map((product, i) =>
          i === index
            ? {
                ...newItem,
                sum_price: parseFloat(
                  (newItem.price - (newItem.price * newItem.sale) / 100) *
                    newItem.quantity
                ).toFixed(2),
              }
            : product
        ),
      }));
    }
    setData((prev) => ({
      ...prev,
      products: prev.products.map((product, i) =>
        i === index
          ? {
              ...newItem,
              sum_price: parseFloat(
                (newItem.price - (newItem.price * newItem.sale) / 100) *
                  newItem.quantity
              ).toFixed(2),
            }
          : product
      ),
    }));
  }
  let offer_price = getOfferPrice();

  function getOfferPrice() {
    let sum = 0;
    for (let i = 0; i < data.products.length; i++) {
      if (data.products[i].sum_price) {
        sum = Number(sum) + Number(data.products[i].sum_price);
      }
    }
    return parseFloat(sum).toFixed(2);
  }

  function getSumPrice() {
    let price = Number(offer_price) + Number((offer_price * vat) / 100);
    if (data.sale) {
      price = Number(price) - Number((price * data.sale) / 100);
    }
    return parseFloat(price).toFixed(2);
  }

  function handleSubmit(e) {
    e.preventDefault();
    let products = data.products?.map((item) => {
      return {
        product_name: item.product_name,
        quantity: item.quantity,
        sale: item.sale,
        price: item.sum_price,
      };
    });
    if (products.every((product) => product.product_name !== "")) {
      if (!props.offer) {
        axios
          .post("/priceoffers", {
            unit: data.unit,
            name: data.name,
            phone: data.phone,
            comment: data.comment,
            offer_price: 1000,
            sale: data.sale,
            is_mail: data.is_mail,
            items: products,
          })
          .then((res) => {
            toast.success("הצעת מחיר נוצרה בהצחה");
            router.push("/price-offers");
          })
          .catch((err) => {
            console.log(err);
            if (err.response.status === 400 || err.response.status === 422) {
              toast.error(err?.response?.data?.message);
            } else toast.error("התרחשה שגיאת שרת, נא לנסות שוב מאוחר יותר");
          });
      } else {
        let items = updateData.items?.map((item) => {
          return {
            id: item.id,
            product_name: item.product_name,
            quantity: item.quantity,
            sale: item.sale,
            price: item.sum_price,
            is_deleted: item.is_deleted,
          };
        });
        axios
          .put(`/priceoffers/${props.offer.id}`, {
            ...updateData,
            items,
          })
          .then((res) => {
            toast.success("הצעת מחיר עודכנה בהצלחה");
            props.close();
            props.getData();
          })
          .catch((err) => {
            console.log(err);
            if (err.response.status === 400 || err.response.status === 422) {
              toast.error(err?.response?.data?.message);
            } else toast.error("התרחשה שגיאת שרת, נא לנסות שוב מאוחר יותר");
          });
      }
    } else toast.error("חובה למלא את כל הפריטים ");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col h-[90%] w-full pb-5 ${
        props.offer && "bg-[rgba(248,248,248,1)] rounded-md"
      }`}
    >
      <div className="flex gap-5 p-10 items-center">
        <div className="flex-1">
          <p className="text-[rgba(201,45,23,1)] text-lg font-bold">יחידה</p>
          <SelectBySearch
            disabled={props.disabled}
            value={data.unit}
            options={units}
            name={"unit"}
            placeholder={"בחר יחידה "}
            handleChangeProp={(e) => handleChange(e)}
          />
        </div>
        <div className="flex-1">
          <Input
            title={true}
            name="name"
            placeholder="שם מלא"
            value={data.name}
            disabled={props.disabled}
            handleChange={handleChange}
            required={true}
          />
        </div>
        <div className="flex-1">
          <Input
            title={true}
            disabled={props.disabled}
            name="phone"
            placeholder="מספר טלפון"
            value={data.phone}
            pattern="[0]{1}[5]{1}[0-9]{8}"
            maxLength={10}
            handleChange={handleChange}
            required={true}
          />
        </div>
      </div>
      <div className="px-10 flex flex-col flex-1 items-center gap-1.5">
        <div className="flex w-full text-xl text-center font-semibold px-10 pl-20 bg-[rgba(201,45,23,1)] text-white rounded-md p-1">
          <div className="flex-1">תיאור השירות / המוצר </div>
          <div className="flex-1">מק"ט</div>
          <div className="flex-1"> יחידות </div>
          <div className="flex-1">מחיר </div>
          <div className="flex-1">הנחה </div>
          <div className="flex-1">סה"כ אחרי הנחה </div>
        </div>
        <div
          dir="ltr"
          className={`w-full ${
            props.offer ? "max-h-[28vh]" : "max-h-[45vh]"
          } p-2 red-scrollbar overflow-y-auto flex flex-col gap-1.5`}
        >
          {data.products?.map((product, i) => {
            return (
              <FormItem
                disabled={props.disabled}
                key={i}
                product={product}
                length={data.products.length}
                index={i}
                setData={(index, newItem) =>
                  handleChangeProducts(index, newItem)
                }
                delete={(indexToRemove) => {
                  if (updateData?.items[indexToRemove]) {
                    handleChangeProducts(indexToRemove, {
                      ...product,
                      is_deleted: 1,
                    });
                  }
                  setData((prev) => {
                    const updatedProducts = prev.products.filter(
                      (_, index) => index !== indexToRemove
                    );
                    return {
                      ...prev,
                      products: updatedProducts,
                    };
                  });
                }}
              />
            );
          })}
        </div>
        {!props.disabled && (
          <button
            type="button"
            onClick={() => {
              let products = data.products;
              setData((prev) => ({
                ...prev,
                products: [
                  ...products,
                  {
                    id: 0,
                    product_name: "",
                    sku: "",
                    quantity: 1,
                    cost: 0,
                    sale: 0,
                    sum_cost: 0,
                    is_deleted: 0,
                  },
                ],
              }));
              setUpdateData((prev) => ({
                ...prev,
                items: [
                  ...prev.items,
                  {
                    id: 0,
                    product_name: "",
                    sku: "",
                    quantity: 1,
                    cost: 0,
                    sale: 0,
                    sum_cost: 0,
                    is_deleted: 0,
                  },
                ],
              }));
            }}
            className="text-[rgba(201,45,23,1)] text-lg font-medium flex mt-2 items-center gap-1"
          >
            <CirclePlus />
            הוסף פריט חדש
          </button>
        )}
      </div>
      <hr className="mx-10 my-5"></hr>
      <footer className="flex px-20 gap-10">
        <div className=" text-xl flex flex-col gap-1 mt-3">
          <div className="flex justify-between">
            <p className="text-[rgba(201,45,23,1)]">סה"כ</p>
            <p>{getOfferPrice()}</p>
          </div>
          <div className="flex relative justify-between gap-1">
            <p className="text-[rgba(201,45,23,1)]">הנחה </p>
            <div className="flex justify-end">
              {!props.disabled && (
                // <input
                //   type="number"
                //   name="sale"
                //   value={data.sale}
                //   onChange={(e) => handleChange(e)}
                //   min={0}
                //   max={100}
                //   className="text-right h-full pr-1 rounded-md bg-white border border-gray-300 ml-1"
                // />
                <NumberInput
                  value={data.sale}
                  name={"sale"}
                  handleChange={(e) => {
                    console.log(e);
                    handleChange(e);
                  }}
                />
              )}
              {props.disabled && <p>{data.sale}</p>}
              <div className="">%</div>
            </div>
          </div>
          <div className="flex justify-between">
            <p className="text-[rgba(201,45,23,1)]">מע"מ ({vat}%)</p>
            <p>{parseFloat((offer_price * vat) / 100).toFixed(2)}</p>
          </div>
          <div className="flex gap-3 justify-between">
            <p className="text-[rgba(201,45,23,1)]">סה"כ לתשלום</p>
            <p>{getSumPrice()}</p>
          </div>
        </div>
        <div className="flex-1 h-[80%]">
          <label className="text-[rgba(201,45,23,1)] text-xl font-bold">
            הערות
          </label>
          <textarea
            placeholder="הערות"
            disabled={props.disabled}
            value={data.comment}
            name="comment"
            onChange={handleChange}
            className="flex w-full h-full bg-[rgba(217,217,217,0.4)] rounded-md pr-2.5 py-2 focus:outline-none resize-none"
          />
        </div>
      </footer>
      <div className="flex mt-3 gap-2 justify-center items-center">
        {!props.offer && (
          <button
            type="button"
            onClick={() => window.history.back()}
            className="bg-gray-300 text-black px-4 py-2 text-xl rounded-md"
          >
            ביטול
          </button>
        )}
        {!props.disabled && (
          <button
            type="submit"
            className="bg-[rgba(201,45,23,1)] text-white px-4 py-2 rounded-md text-xl hover:opacity-70 "
          >
            {props.offer ? "שמור שינויים" : "יצירת בקשה"}
          </button>
        )}
        {/* <label className="flex text-lg items-center gap-2 text-[rgba(120, 120, 120, 1)]">
          <input
            type="checkbox"
            disabled={props.disabled}
            checked={data.is_mail}
            name="is_mail"
            onChange={(e) =>
              handleChange({
                target: { name: e.target.name, value: e.target.checked },
              })
            }
            className=" w-[18px] h-[18px] rounded-lg accent-[rgba(201,45,23,1)]"
          />
          <p>שליחת מייל אוטומטית</p>
        </label> */}
      </div>
    </form>
  );
}
