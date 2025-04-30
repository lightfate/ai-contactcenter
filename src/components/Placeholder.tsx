import type React from "react"

interface PlaceholderProps {
  width: number
  height: number
  text?: string
  className?: string
}

const Placeholder: React.FC<PlaceholderProps> = ({ width, height, text, className = "" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ maxWidth: "100%", height: "auto" }}
    >
      <rect width={width} height={height} fill="#00CFDD" fillOpacity="0.1" />
      <rect x="1" y="1" width={width - 2} height={height - 2} stroke="#00CFDD" strokeOpacity="0.2" strokeWidth="2" />
      <text
        x="50%"
        y="50%"
        fontFamily="sans-serif"
        fontSize="14"
        fill="#00CFDD"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {text || `${width}x${height}`}
      </text>
    </svg>
  )
}

export default Placeholder
