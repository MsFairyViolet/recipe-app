   import { useState } from "react"

   export default function ErrorToolTip({message}) {

   const [isTooltipOpen, setIsToolTipOpen] = useState(false)

   return (
      <div onBlur={() => setIsToolTipOpen(false)}>
         <button className="error-alert-button" onClick={() => setIsToolTipOpen(!isTooltipOpen)}></button>
         {isTooltipOpen && (
            <div className="tooltip" >{message}</div>
         )}
      </div>

   )
}