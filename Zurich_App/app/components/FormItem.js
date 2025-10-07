import React, { useEffect, useState } from "react";
import SelectBySearch from "./SelectBySearch";
import Input from "./Input";
import ButtonAnimation from "./ButtonAnimation";
import axios from "../lib/axios";
import NumberInput from "./NumberInput";

export default function FormItem(props) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios
      .get("/products")
      .then((res) => {
        let arr = res.data.data;
        arr = arr?.map((product) => {
          return { label: product.describe, value: product.id };
        });
        setProducts(arr);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleChange(e) {
    let sum_price = parseFloat(
      (props.product.price - (props.product.price * props.product.sale) / 100) *
        props.product.quantity
    ).toFixed(2);
    props.setData(props.index, {
      ...props.product,
      [e.target.name]: e.target.value,
      sum_price,
    });
  }

  function handleChangeItem(e) {
    if (!e.target.value) {
      props.setData(props.index, {
        ...props.product,
        product_name: "",
        sku: "",
        price: 0,
        sum_price: 0,
      });
      return;
    }
    axios.get(`products/${e.target.value}`).then((res) => {
      let newData = res.data.data[0];
      props.setData(props.index, {
        id: props.product.id,
        product_name: e.target.value,
        sku: newData.sku,
        quantity: props.product.quantity,
        price: newData.sale_price,
        sale: props.product.sale,
        is_deleted: props.product.is_deleted,
        sum_price: parseFloat(
          (newData.sale_price -
            (newData.sale_price * props.product.sale) / 100) *
            props.product.quantity
        ).toFixed(2),
      });
    });
  }
  return (
    <div
      dir="rtl"
      className={`flex w-full ${
        props.length === 1 && "pl-20"
      } text-xl text-center px-8  gap-5 bg-white rounded-md p-2 shadow-[0px_0px_9.4px_0px_rgba(0,0,0,0.1)]`}
    >
      <div className="flex-1">
        <SelectBySearch
          options={products}
          disabled={props.disabled}
          name={"product_name"}
          value={props.product.product_name}
          placeholder={" תיאור המוצר"}
          handleChangeProp={(e) => handleChangeItem(e)}
        />
      </div>
      <div className=" flex-1 flex items-center justify-center rounded-md bg-[rgba(217,217,217,0.4)] ">
        {props.product.sku}
      </div>
      {/* <input
        dir="ltr"
        type="number"
        name="quantity"
        value={props.product.quantity}
        onChange={(e) => {
          handleChange(e);
        }}
        min={1}
        className=" flex-1 rounded-md pl-3 bg-transparent text-center border border-gray-300"
      /> */}
      <NumberInput
          style={
            " flex-1 rounded-md pl-3 bg-transparent text-center border border-gray-300"
          }
          value={props.product.quantity}
          name={"quantity"}
          handleChange={(e) => {
            handleChange(e);
          }}
        />
      <div className=" flex-1 flex items-center justify-center rounded-md bg-[rgba(217,217,217,0.4)] ">
        {props.product.price}
      </div>
      <div className="flex-1 flex relative items-center">
        {/* <input
          type="number"
          name="sale"
          value={props.product.sale}
          onChange={(e) => handleChange(e)}
          min={0}
          max={100}
          className="text-right w-full h-full rounded-md pr-7 bg-transparent border border-gray-300"
        /> */}
        <NumberInput
          style={
            "text-right w-full h-full rounded-md pr-7 bg-transparent border border-gray-300"
          }
          value={props.product.sale}
          name={"sale"}
          handleChange={(e) => {
            handleChange(e);
          }}
        />
        <div className="absolute right-2">%</div>
      </div>
      <div className=" flex-1 flex items-center justify-center rounded-md bg-[rgba(217,217,217,0.4)] ">
        {props.product.sum_price}
      </div>
      {props.length > 1 && (
        <div onClick={() => props.delete(props.index)}>
          <ButtonAnimation
            animation={"/trash-open.png"}
            icon={"/trash.png"}
            size={24}
          />
        </div>
      )}
    </div>
  );
}
