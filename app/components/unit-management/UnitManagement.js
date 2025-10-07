import React, { use, useEffect, useState } from 'react'
import DeletePopUp from '../global/DeletePopUp';
import ButtonAnimation from '../ButtonAnimation';
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "@/app/lib/axios";


export default function UnitManagement({ data = [], row, id, index, getData }) {
    const [unitName, setunitName] = useState(""); // unit name 
    const [unitId, setunitId] = useState(null);// unit index 
    const [formDetails, setFormDetails] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [isEditing, setIsEditing] = useState(true);
    const [popup, setPopUp] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [formValues, setFormValues] = useState(formDetails.map(row => row.name));
    useEffect(() => {
        let units = [];
        data.map((unit) => {
            units.push({
                id: unit.id,
                name: unit.name,
            });
        });
        setFormDetails(units);
    }, [data]);

    // Notify Message 
    const notifyMessage = (type) => {
        if (type === "delete") {
            toast.success("מחיקה התבצעה בהצלחה",
                {
                    position: "bottom-right"
                })
        }
        else if (type === "edit") {
            toast.success("עריכה התבצעה בהצלחה",
                {
                    position: "bottom-right"
                })
        }
    }
    const errorNofify = (type) => {
        if (type === "exist") {
            toast.error("קיימת יחידה כזאת במערכת 409", {
                position: "bottom-right"
            })
        }
        if (type === "empty") {
            toast.error("הכנסה ריקה, לא נוצר שינוי ", {
                position: "bottom-right"
            })
        }
        else {
            toast.error("קרתה שגיאה בעת ביצוע הפעולה, אנא נסה שוב מאוחר יותר", {
                position: "bottom-right"
            })
        }
    }

    //Delete popUp functionalty
    async function handleDelete(id) {
        console.log(isEditing);
        try {
            console.log(id);
            await axios.delete(`units/${id}`)
            notifyMessage("delete");
            setIsEditing(false);
            setIsDisabled(true);
            setEditIndex(null)
            await getData();
        }
        catch (err) {
            console.error(err);
            errorNofify();
        }
    }
    function handleOpen(e) {
        console.log("opend")
        setunitName(e.currentTarget.name);
        setunitId(e.currentTarget.id);
        e.currentTarget.value === "delete" &&
            setPopUp((prev) => ({ ...prev, delete: true }))
    }
    function handleClose() {
        setunitName("");
        setunitId(null);
        popup.delete
            && setPopUp((prev) => ({ ...prev, delete: false }));
    }

    // Edit functionalty
    const handleEditClick = (index) => {
        console.log("handleEditClick")
        setEditIndex(index);
        setIsEditing(true); // החזר את מצב העריכה
        setIsDisabled(false); // החזר את ה-input ל-Editable
    }
    const handleEdit = async (e) => {
        e.preventDefault();
        let units = [];
        units.push({
            id: e.id,
            name: e.inputValue,
        });
        if (inputValue.length > 0) {
            setIsEditing(true);
            setIsDisabled(true);
            console.log('Submitted');

            // Check if the unit already exists
            try {
                const response = await axios.get('/units');
                const existingUnits = response.data.data;

                // Check if the new unit already exists
                const unitExists = existingUnits.some(unit => unit.name === inputValue);

                if (unitExists) {
                    // Optionally, show a notification or error message to the user
                    errorNofify('exist');
                    setIsEditing(true);
                    setIsDisabled(false);
                    return; // Exit early if the unit already exists
                }
                console.log(inputValue)
                // Proceed with creating a new unit if it does not exist
                const newUnit = {
                    name: inputValue,
                }
                await axios.put(`units/${id}`, newUnit);
                notifyMessage("edit");
                setIsEditing(false);
                setIsDisabled(true);
                setEditIndex(null)
                await getData();
            } catch (error) {
                console.error('Error submitting data:', error);
                errorNofify();
            }
        } else {
            console.log('Input is empty');
            errorNofify("empty");
            setIsEditing(false);
            setIsDisabled(true);
            setEditIndex(null)
            await getData();
        }
    }
    const handleInputChange = (e, index) => {
        const newValue = e.target.value;
        const newValues = [...formValues];
        setInputValue(newValue);
        setFormValues(newValues);
    };

    return (
        <>
            <div key={id} className="flex items-center">
                <div className={`rounded-xl h-[56.65px] w-full shadow-sm flex items-center justify-start cursor-pointer bg-[#FFFFFF]`}>
                    <div className="flex w-3/4 justify-between">
                        <div className='flex w-1/6 items-center justify-center'>
                            <h1 className="text-[20px] text-[#787878]">{index + 1}</h1>
                        </div>
                        <div className='flex w-3/4 justify-start'>
                            <input
                                className={`bg-[#FFFFFF] text-[20px] text-[#787878] rounded-md  
                                    ${editIndex === index ? 'border-2 items-start  border-[#e6e6e6] text-[20px] text-[#9da4b0] rounded-md' : 'text-[#9da4b0]'}
                                    ${isDisabled ? 'border-0 border-transparent' : ''}
                                    ${isEditing ? '' : 'border-0 border-[#e6e6e6]'}`
                                }
                                disabled={isDisabled && editIndex !== index} // מצב עריכה
                                placeholder={row.name}
                                value={formValues[index]}
                                onChange={(e) => handleInputChange(e, index)}
                                defaultValue={row.name}
                            />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <div className='flex px-10 gap-2 justify-end items-center'>
                            {editIndex === index && isEditing ? (
                                <button
                                    className="bg-[rgba(62,175,63,0.21)] p-2 rounded-md"
                                    onClick={(e) => handleEdit(e, id)}
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
                                name={row.name}
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
            </div>
            {popup.delete && (
                <DeletePopUp
                    HandleClose={handleClose}
                    type={'unit'}
                    name={unitName}
                    handleDeleteProp={() => handleDelete(unitId)}
                />
            )}
        </>
    )
}