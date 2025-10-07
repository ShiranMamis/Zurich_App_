"use client";
import React, { useState, useEffect, useRef } from 'react'
import Image from "next/image";
import FixedProducts from './FixedProducts'
import PriceOffer from '../PriceOffer';
import { HelpCircle, CircleX, CircleCheck } from "lucide-react";
import Skeleton from 'react-loading-skeleton';
import ButtonAnimation from '../ButtonAnimation';
import axios from "@/app/lib/axios";

export default function ProductsForm({ data = [], isAddProduct, handleCloseForm, getData }) {
    const [statusClicked, setStatusClicked] = useState(false);
    const [isEditing, setIsEditing] = useState(true);// chang to false 
    const [isDisabled, setIsDisabled] = useState(false);
    const statusRef = useRef(null);
    const containerRef = useRef(null); // Ref for the whole container that wraps the status
    const [typeStatus, SetTypeStatus] = useState("");
    const [rowInputValue, setRowInputValue] = useState({
        sku_input: '',           // מק"ט
        describe_input: '',   // תיאור השירות/המוצר
        costPrice_input: '',     // מחיר עלות
        comission_input: '',// אחוז עמלה
        salePrice_input: '',  // מחיר מכירה
        status: typeStatus,
    })
    function handelStatusClick(e, index, row) {
        e.preventDefault();
        console.log("is clicked");
        console.log(row?.status)
        setStatusClicked(true);
    }
    const handleClickStatus = async (status) => {
        console.log("Status clicked:", status);
        SetTypeStatus(status);
        setRowInputValue(prevState => ({
            ...prevState,
            status: status
        }));
        await getData()
        setStatusClicked(false); // Or handle status as needed
    }
    const [errors, setErrors] = useState({
        sku: false,
        describe: false,
        cost_price: false,
        comission: false,
        sale_price: false,
        status: false
    })

    ///handle Add Product 
    function handleCloseFormAll() {
        handleCloseForm();
        SetTypeStatus("")
        setIsEditing(true);
        setIsDisabled(false);
        setRowInputValue({
            sku_input: '',           // מק"ט
            describe_input: '',   // תיאור השירות/המוצר
            costPrice_input: '',     // מחיר עלות
            comission_input: '',// אחוז עמלה
            salePrice_input: '',  // מחיר מכירה
            status: ''        // סטטוס
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form fields
        const newErrors = {
            sku: !rowInputValue.sku_input.trim(),
            describe: !rowInputValue.describe_input.trim(),
            cost_price: !rowInputValue.costPrice_input.trim(),
            comission: !rowInputValue.comission_input.trim(),
            // sale_price: !rowInputValue.salePrice_input.trim() // Uncomment if necessary
        };

        // Update the error state
        setErrors(newErrors);

        // Check if there are errors
        if (Object.values(newErrors).some(error => error)) {
            console.log('יש למלא את כל השדות.');
            return; // Exit if there are errors
        }

        // Proceed with form submission
        try {
            await axios.post('/products', {
                sku: rowInputValue.sku_input,
                describe: rowInputValue.describe_input,
                cost_price: rowInputValue.costPrice_input,
                comission: rowInputValue.comission_input,
                sale_price: rowInputValue.salePrice_input,
                status: rowInputValue.status
            });
            //notifyMessage("add");
            await getData()
            handleCloseFormAll();
        } catch (error) {
            console.error('שגיאה בשליחת הנתונים:', error);
            //errorNofify();
        }
    }
    useEffect(() => {
        // בדוק אם הערכים לא ריקים
        if (rowInputValue.costPrice_input != null && rowInputValue.comission_input != null) {
            // המרת הערכים למספרים
            const costPrice = parseFloat(rowInputValue.costPrice_input);
            const commissionPercentage = parseFloat(rowInputValue.comission_input);

            // בדוק אם הערכים הם מספרים תקינים
            if (!isNaN(costPrice) && !isNaN(commissionPercentage)) {
                // חישוב אחוז העמלה
                const commissionAmount = (costPrice * commissionPercentage) / 100;

                // חישוב מחיר המכירה
                const salePrice = costPrice + commissionAmount;

                // הצגת התוצאה עם שני ספרות אחרי הנקודה
                const salePriceFixed = salePrice.toFixed(2);

                // עדכון הערך של salePrice ב-state
                setRowInputValue(prevState => ({
                    ...prevState,
                    salePrice_input: salePriceFixed
                }));
            } else {
                console.error('Invalid input values.');
            }
        } else {
            console.error('Cost price or commission is null.');
        }
    }, [rowInputValue.costPrice_input, rowInputValue.comission_input]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // עדכון הערך במצב באופן ישיר לפי שם השדה
        setRowInputValue(prevValues => ({
            ...prevValues,
            [`${name}_input`]: value
        }));
        // ניקוי השגיאה עבור השדה הנוכחי
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: false
        }));
    }
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [])
    const handleClickOutside = (event) => {
        if (statusRef.current && !statusRef.current.contains(event.target) &&
            containerRef.current && !containerRef.current.contains(event.target)) {
            setStatusClicked(false);
        }
    }
    return (
        <div>
            <div onSubmit={handleSubmit} className='flex z-50 items-center absolute mr-[67%]'>
                {statusClicked && (
                    <div ref={statusRef} className="bg-white z-50 p-2 rounded-md shadow-[0px_0px_9.4px_0px_rgba(0,0,0,0.1)] w-[134px] bottom-50 h-[99px] ">
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
            <form className="flex z-0 items-center p-1 ">
                <div className={`rounded-xl h-[80px] w-full shadow-sm items-center justify-start cursor-pointer bg-[#FFFFFF] grid grid-cols-8 gap-1`}>
                    <div className="flex col-span- px-3 justify-center items-center">
                        <input
                            className={`focus:bg-[#ecebeb] focus:border-0 focus:outline-none w-full border-2 text-center ml-3 text-[20px] text-[#787878] rounded-md
                                ${errors.sku ? ' border-red-500' : 'border-[#e6e6e6]'}
                                ${isDisabled ? 'border-0 bg-transparent' : ''}
                                ${isEditing ? '' : 'border-0 border-[#e6e6e6]'}`
                            }
                            value={rowInputValue.sku_input}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                            name='sku'
                            placeholder='מק"ט'
                        />
                    </div>
                    <div className="flex col-span-2 px-3 justify-center items-center">
                        <input
                            className={`focus:bg-[#ecebeb] focus:border-0 focus:outline-none w-[90%] border-2 text-center text-[20px] text-[#787878] rounded-md
                                ${errors.describe ? 'border-red-500' : 'border-[#e6e6e6]'}
                                ${isDisabled ? 'border-0 bg-transparent' : ''}
                                ${isEditing ? '' : 'border-0 border-[#e6e6e6]'}`
                            }
                            value={rowInputValue.describe_input}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                            name='describe'
                            placeholder='תיאור השירות /המוצר'
                        />
                    </div>
                    <div className="flex col-span-1 px-3 justify-center items-center">
                        <div className="flex col-span-1 px-3 justify-center items-center">
                            <div className="flex col-span-1 px-3 justify-center items-center">
                                <input
                                    className={`focus:bg-[#ecebeb] focus:border-0 focus:outline-none w-[90%] border-2 text-center text-[20px] text-[#787878] rounded-md
                                        ${errors.cost_price ? 'border-red-500' : 'border-[#e6e6e6]'}
                                        ${isDisabled ? 'border-0 bg-transparent' : ''}
                                        ${isEditing ? '' : 'border-0 border-[#e6e6e6]'}`
                                    }
                                    value={rowInputValue.costPrice_input}
                                    onChange={handleInputChange}
                                    disabled={isDisabled}
                                    type="number"
                                    step="0.01"
                                    name='costPrice'
                                    placeholder='מחיר עלות'
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex col-span-1 px-3 justify-center items-center">
                        <input
                            className={`focus:bg-[#ecebeb] focus:border-0 focus:outline-none w-[90%] border-2 text-center text-[20px] text-[#787878] rounded-md
                                ${errors.comission ? 'border-red-500' : 'border-[#e6e6e6]'}
                                ${isDisabled ? 'border-0 bg-transparent' : ''}
                                ${isEditing ? '' : 'border-0 border-[#e6e6e6]'}`
                            }
                            value={rowInputValue.comission_input}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                            type="number"
                            step="0.01"
                            name='comission'
                            placeholder='אחוז עמלה'
                        />
                    </div>
                    <div className="flex col-span-1 px-3 justify-center items-center">
                        <input
                            className={`focus:bg-[#ecebeb] focus:border-0 focus:outline-none w-[90%] border-2 text-center text-[20px] text-[#787878] rounded-md
                                ${errors.sale_price ? 'border-red-500' : 'border-[#e6e6e6]'}
                                ${isDisabled ? 'border-0 bg-transparent' : ''}
                                ${isEditing ? '' : 'border-0 border-[#e6e6e6]'}`
                            }
                            value={rowInputValue.salePrice_input}
                            onChange={handleInputChange}
                            disabled={true}
                            type="number"
                            step="0.01"
                            name='salePrice'
                            placeholder='מחיר למכירה'
                        />
                    </div>
                    <div ref={containerRef} className="relative flex col-span-1 px-3 justify-center items-center ">
                        <button
                            className={`flex col-span-1 px-3 justify-center items-center ${errors.sale_price ? ' border-red-500' : ''}`}
                            onClick={(e) => handelStatusClick(e)}>
                            {typeStatus === '1'
                                ? <div className='bg-[#E5F4E5] items-center justify-center gap-2 rounded-xl flex w-[134px] h-[42px]'>
                                    <CircleCheck className='text-[#29822A] h-[15px] w-[15px]' />
                                    <h1 className='text-[#29822A] text-[20px]'>יש מלאי</h1>
                                </div>
                                : typeStatus === '0'
                                    ? <div className='bg-[#FAEDEB] items-center justify-center gap-2 rounded-xl flex w-[134px] h-[42px]'>
                                        <CircleX className='text-[#C92D17] h-[15px] w-[15px]' />
                                        <h1 className='text-[#C92D17] text-[20px]'>אין מלאי</h1>
                                    </div>
                                    : <div className={`bg-[#f5f5f5] items-center justify-center gap-2 rounded-xl flex w-[134px] h-[42px]`}>
                                        <HelpCircle height={24} width={24} className='text-[#D4D4D4]' />
                                    </div>}
                        </button>
                    </div>
                    <div className="flex col-span-1 px-3 gap-6 justify-center items-center ">
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="bg-[rgba(62,175,63,0.21)] p-2 rounded-md"
                        >
                            <Image src={"/Frame.png"} width={25} height={25} />
                        </button>
                        <button onClick={() => { handleCloseFormAll() }}>
                            <ButtonAnimation
                                animation={"/trash-open.png"}
                                icon={"/trash.png"}
                                size={24}
                            />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}