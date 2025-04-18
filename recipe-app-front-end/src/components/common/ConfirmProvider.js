"use client"

import { createContext, useContext, useState, useCallback } from "react";

const ConfirmContext = createContext(null)

export function ConfirmProvider({ children }) {
   const [isOpen, setIsOpen] = useState(false)
   const [message, setMessage] = useState("")
   const [value, setValue] = useState("")
   const [hasInput, setHasInput] = useState(false);
   const [inputValue, setInputValue] = useState("")
   const [resolvePromise, setResolvePromise] = useState(null)

   const confirm = useCallback((message, value, hasInput = false) => {
      setMessage(message)
      setValue(value)
      setHasInput(hasInput)
      setInputValue(value)
      setIsOpen(true)

      return new Promise((resolve) => {
         setResolvePromise(() => resolve)
      })
   }, [])

   const handleConfirm = () => {
    if (resolvePromise) {
      resolvePromise(hasInput ? inputValue : true)
      cleanup()
    }
  };

  const handleCancel = () => {
    if (resolvePromise) {
      resolvePromise(false)
      cleanup()
    }
  };

  const cleanup = () => {
    setIsOpen(false)
    setMessage("")
    setValue("")
    setInputValue("")
    setHasInput(false)
    setResolvePromise(null)
  };

   return (
      <ConfirmContext.Provider value={{ confirm }}>
         {children}

         {isOpen && (
            <div className="overlay">
               <div className="overlay-content">
                  <p>{message} <strong>{value}</strong>?</p>

                  {hasInput && (
                     <input type="text" value={inputValue} autofocus onChange={(e) => setInputValue(e.target.value)}/>
                  )}
                  <div className="overlay-buttons">
                     <button onClick={handleCancel}>Cancel</button>
                     <button onClick={handleConfirm}>Confirm</button>
                  </div>
               </div>
            </div>
         )}
      </ConfirmContext.Provider>
   )
}

export function useConfirm() {
   const context = useContext(ConfirmContext)
   if (!context){
      throw new Error("useConfirm must be used within a ConfirmProvider")
   }
   return context.confirm
}