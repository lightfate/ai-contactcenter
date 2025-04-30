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
            radial-gradient(circle, rgba(120, 120, 120, 0.12) 0.8px, transparent 0.8px),
            radial-gradient(circle, rgba(160, 160, 160, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "26px 26px, 34px 34px",
          backgroundPosition: "0 0, 13px 13px",
        }}
      />
    </div>
  )
}

export default GridDotBackground