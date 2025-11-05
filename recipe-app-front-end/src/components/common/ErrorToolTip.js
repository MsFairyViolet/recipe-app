import { useState } from "react"

export default function ErrorToolTip({ message }) {

   const [isTooltipOpen, setIsToolTipOpen] = useState(false)

   console.log("ErrorToolTip rendering")

   return (
      <div
         onBlur={() => setIsToolTipOpen(false)}
      >
         {isTooltipOpen && (
            <div className="error-tool-tip">{message}</div>
         )}
         <button className="error-alert-button" onClick={() => setIsToolTipOpen(!isTooltipOpen)}></button>
      </div>

   )
}
