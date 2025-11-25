import { useState } from "react"

export default function ErrorToolTip({ message }) {

   const [isTooltipOpen, setIsToolTipOpen] = useState(false)

   return (
      <div
         onBlur={() => setIsToolTipOpen(false)}
      >
         {isTooltipOpen && (
            <div data-test="tooltip-content" className="error-tool-tip">{message}</div>
         )}
         <button data-test="tooltip-button" className="error-alert-button" onClick={() => setIsToolTipOpen(!isTooltipOpen)}></button>
      </div>

   )
}
