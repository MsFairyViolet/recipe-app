"use client"

import { useState } from "react"

export default function CustomSelector({options = [], selected, onSelect, getOptionLabel = (item) => item, placeholder = "Select...", className = "", dataTest}) {
   const [isOpen, setIsOpen] = useState(false)

   const handleFocus = () => {
      setIsOpen(true)
   }

   const handleBlur = () => {
      setIsOpen(false)
   }

   return (
      <>
         <div className={`select-container ${className}`}>
            <div className={`select-box ${dataTest}`}
               tabIndex={0}
               onMouseDown={() => handleFocus()}
               onBlur={() => handleBlur()}>
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
