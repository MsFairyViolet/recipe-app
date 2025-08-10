"use client"

import { useState } from "react"

export default function Select({options, selected, onSelect, getOptionLabel, placeholder, styleType, dataTest}) {
   const [isOpen, setIsOpen] = useState(false)

   const handleFocus = () => {
      setIsOpen(true)
   }

   const handleBlur = () => {
      setIsOpen(false)
   }

   return (
      <>
         <div className={`select-container ${styleType === "inline" ? "third-column" : "small-detail-box"}`} data-test={dataTest}>
            <div className={`select-box ${styleType === "card-box" ? "cuisine" : ""}`}
               tabIndex={0}
               onMouseDown={handleFocus}
               onBlur={handleBlur}>
               <span className={`dropdown-label ${!selected ? "placeholder" : ""}`}>{selected || placeholder}</span>
               <span className="dropdown-arrow">&#9662;</span>
            </div>
            {isOpen && (
               <ul className="dropdown-options" data-test={`${dataTest}-options`} >
                  {options.map((item, index) => (
                     <li
                        key={`${getOptionLabel(item)}-${index}`}
                        onMouseDown={(e) => {
                           e.preventDefault()
                           onSelect(getOptionLabel(item))
                           setIsOpen(false)
                        }}
                     >
                        {getOptionLabel(item)}
                     </li>
                  ))}
               </ul>
            )}
         </div>
      </>
   )
}
