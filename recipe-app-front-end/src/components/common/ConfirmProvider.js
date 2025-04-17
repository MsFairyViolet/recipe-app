"use client"

import { createContext, useContext, useState, useCallback } from "react";

const ConfirmContext = createContext(null)

export function ConfirmProvider({ children }) {
   const [isOpen, setIsOpen] = useState(false)
   const [message, setMessage] = useState("")
   const [value, setValue] = useState("")
   const [resolvePromise, setResolvePromise] = useState(null)

   const confirm = useCallback((message, value) => {
      setMessage(message)
      setValue(value)
      setIsOpen(true)
      return new Promise((resolve) => {
         setResolvePromise(() => resolve)
      })
   }, [])

   const handleConfirm = () => {
      if (resolvePromise) {
         resolvePromise(true)
         setIsOpen(false)
      }
   }

   const handleCancel = () => {
      if (resolvePromise) {
         resolvePromise(false)
         setIsOpen(false)
      }
   }

   return (
      <ConfirmContext.Provider value={{ confirm }}>
         {children}

         {isOpen && (
            <div className="overlay">
               <div className="overlay-content">
                  <p>{message} <strong>{value}</strong>?</p>
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