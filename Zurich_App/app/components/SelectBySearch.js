import Select from "react-select";
import React, { useEffect, useState } from "react";

export default function SelectBySearch({
  options,
  name,
  handleChangeProp,
  placeholder,
  isClicked,
  value,
  disabled,
}) {
  const [error, setError] = useState(false);

  // Find the selected option based on the value prop
  const selectedOption = options.find((option) => option.value === value);

  function handleChange(selectedOption) {
    if (selectedOption) setError(false);
    else if (isClicked) setError(true);

    let selectedValue = "";
    if (selectedOption?.value) selectedValue = selectedOption?.value;

    handleChangeProp({
      target: {
        name: name,
        value: selectedValue,
      },
    });
  }

  useEffect(() => {
    if (isClicked && !value) {
      setError(true);
    } else if (isClicked && value) {
      setError(false);
    }
  }, [isClicked]);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: "0",
      borderWidth: 1,
      borderColor: "none",
      borderRadius: "6px",
      backgroundColor: "rgba(217,217,217,0.4)",
      boxShadow: state.isFocused ? "none" : provided.boxShadow, // Remove box-shadow on focus
      "&:hover": {
        borderColor: error ? "rgba(201, 21, 9, 1)" : "rgba(0,0,0,0.2)", // Maintain border color on hover
      },
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      borderRadius: "8px",
      color: "gray",
    }),
    indicatorSeparator: () => ({
      boxShadow: "0px 0px 8.1px 0px rgba(0, 0, 0, 0.2)",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgba(158, 158, 158, 1)",
    }),
    menu: (provided) => ({
      ...provided,
      padding: "2px",
      borderRadius: "8px",
      boxShadow: "0px 4px 8.1px 0px rgba(0, 0, 0, 0.2)",
      zIndex: 30,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "5",
      maxHeight: "200px",
      overflowY: "auto",
      overflowX: "hidden",
      borderRadius: "8px",
      boxShadow: "0px 0px 8.1px 0px rgba(0, 0, 0, 0.2)",
      backgroundColor: "rgba(217,217,217,0.4)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "rgba(201, 21, 9, 1)" : "none",
      borderRadius: "8px",
      marginRight: "1px",
      Width: "100px",
      color: "black",
      "&:hover": {
        backgroundColor: "rgba(201, 21, 9, 1)",
        color: "white",
        backgroundColor: "rgba(201, 21, 9, 1)",
      },
      display: "flex",
      alignItems: "center",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  return (
    <>
      <Select
        className="red-scrollbar"
        options={options}
        onChange={handleChange}
        name={name}
        value={selectedOption}
        classNamePrefix="react-select"
        isSearchable
        isDisabled={disabled}
        // isLoading={!value}
        isMulti={false}
        isClearable
        placeholder={placeholder}
        noOptionsMessage={() => "אין תוצאות"}
        styles={customStyles}
        menuPortalTarget={document.body}
        isRtl
        filterOption={(option, inputValue) =>
          option?.label.toLowerCase().includes(inputValue.toLowerCase())
        }
      />
      {error && (
        <p className={`text-mediumRed text-center text-sm font-semibold`}>
          שדה זה הוא חובה
        </p>
      )}
    </>
  );
}
