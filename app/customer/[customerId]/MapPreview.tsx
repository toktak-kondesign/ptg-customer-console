export default function MapPreview() {
  return (
    <svg
      viewBox="0 0 180 110"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="180" height="110" fill="#EAF1E4" />
      {/* water */}
      <path
        d="M128 -6h58v56c-14 8-28 5-37-5s-17-28-21-51z"
        fill="#BFDFEF"
      />
      {/* park */}
      <path
        d="M-6 26h46v36H4C-3 55-6 42-6 26z"
        fill="#D4E7CA"
      />
      <rect x="118" y="66" width="34" height="26" rx="4" fill="#D4E7CA" />
      {/* minor roads */}
      <g stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round">
        <path d="M0 34h180" />
        <path d="M0 78h180" />
        <path d="M44 0v110" />
        <path d="M96 0v110" />
        <path d="M148 44v66" />
      </g>
      {/* main road */}
      <path
        d="M0 62C46 54 96 74 180 48"
        fill="none"
        stroke="#F9D86C"
        strokeWidth="5"
      />
      <path
        d="M0 62C46 54 96 74 180 48"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.4"
        strokeDasharray="7 7"
      />
      {/* pin */}
      <g transform="translate(118,44)">
        <path
          d="M0 16C-10 4 -10 -9 0 -9S10 4 0 16z"
          fill="#E5484D"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
        <circle cy="-2.5" r="3.4" fill="#FFFFFF" />
      </g>
    </svg>
  );
}
