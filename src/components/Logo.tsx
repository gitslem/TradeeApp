const Logo = ({ size = 24 }: { size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="modernGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>

      {/* Modern Bold T - Single unified shape */}
      <path
        d="M 15 10 L 85 10 L 85 30 L 60 30 L 60 90 L 40 90 L 40 30 L 15 30 Z"
        fill="url(#modernGradient)"
      />

      {/* Accent detail - modern geometric cut */}
      <path
        d="M 45 35 L 55 35 L 55 45 L 45 45 Z"
        fill="white"
        opacity="0.3"
      />
    </svg>
  )
}

export default Logo
