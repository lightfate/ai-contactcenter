import type React from "react"

interface GridDotBackgroundProps {
  className?: string
}

const GridDotBackground: React.FC<GridDotBackgroundProps> = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(70, 70, 70, 0.15) 0.5px, transparent 0.5px)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0",
        }}
      />
    </div>
  )
}

export default GridDotBackground