"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react";

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
      if (hasInput && inputValue.trim() === "") {
         alert("Can't be empty. Please provide an input.")
         return
      }

      if (resolvePromise) {
         resolvePromise(hasInput ? inputValue : true)
         cleanup()
      }
   }

   const handleCancel = () => {
      if (resolvePromise) {
         resolvePromise(false)
         cleanup()
      }
   }

   const cleanup = () => {
      setIsOpen(false)
      setMessage("")
      setValue("")
      setInputValue("")
      setHasInput(false)
      setResolvePromise(null)
   }

   useEffect(() => {
      const handleKeyDown = (e) => {
         if (e.key === "Enter") {
            e.preventDefault()
            handleConfirm()
         } else if (e.key === "Escape") {
            e.preventDefault()
            handleCancel()
         }
      }
      if (isOpen) {
         document.addEventListener("keydown", handleKeyDown)
      }

      return () => document.removeEventListener("keydown", handleKeyDown)
   }, [isOpen])

   return (
      <ConfirmContext.Provider value={{ confirm }}>
         {children}

         {isOpen && (
            <div className="overlay">
               <div className="overlay-content">
                  <p data-test="overlay-message">{message} <strong data-test="overlay-value">{value}</strong>?</p>

                  {hasInput && (
                     <input data-test="overlay-input" type="text" value={inputValue} autoFocus onChange={(e) => setInputValue(e.target.value)} />
                  )}
                  <div className="overlay-buttons">
                     <button data-test="cancel-button" onClick={handleCancel}>Cancel</button>
                     <button data-test="confirm-button" onClick={handleConfirm}>Confirm</button>
                  </div>
               </div>
            </div>
         )}
      </ConfirmContext.Provider>
   )
}

export function useConfirm() {
   const context = useContext(ConfirmContext)
   if (!context) {
      throw new Error("useConfirm must be used within a ConfirmProvider")
   }
   return context.confirm
}