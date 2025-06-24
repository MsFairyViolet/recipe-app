"use client"

import { useState, useEffect } from "react"
import IngredientsPage from "@components/IngredientsList/IngredientsPage"

export default function IngredientsListContainer() {
   const [ingredients, setIngredients] = useState(null)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)

   const fetchIngredients = () => {
      fetch("/api/ingredient")
         .then((response) => {
            if (!response.ok) {
               throw new Error("Failed to fetch recipes")
            }
            return response.json()
         })
         .then((data) => {
            setIngredients(data)
            setLoading(false)
         })
         .catch((error) => {
            console.log("Error fetching recipes: ", error)
            setError(error.message)
            setLoading(false)
         })
   }

   useEffect(() => {
      fetchIngredients()
   }, [])

   if (loading) {
      return <p className="warning">Loading ingredients...</p>
   }

   if (error) {
      return <p className="warning error">Failed to fetch ingredients.</p>
   }

   return (
      <IngredientsPage ingredients={ingredients} fetchIngredients={fetchIngredients} error={error} />
   )
}
