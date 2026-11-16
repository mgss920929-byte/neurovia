export function NeuroviaLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#3988EF] via-[#6366F1] to-[#8065F5] p-[1px] shadow-lg shadow-[#3988EF]/25 ${className}`}
    >
      <div className="w-full h-full rounded-[11px] bg-[#0B1222] flex items-center justify-center relative overflow-hidden">
        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#3988EF]/20 to-[#8065F5]/20" />
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 relative z-10"
        >
          {/* Neural Hexagon Frame */}
          <path
            d="M16 3L27.2583 9.5V22.5L16 29L4.74167 22.5V9.5L16 3Z"
            stroke="url(#neuro_grad)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Inner Synapse N-Pulse */}
          <path
            d="M11 21V11L21 21V11"
            stroke="#F4F7FF"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Node Dots */}
          <circle cx="11" cy="11" r="2" fill="#38BDF8" />
          <circle cx="21" cy="21" r="2" fill="#A855F7" />
          <defs>
            <linearGradient id="neuro_grad" x1="4" y1="3" x2="28" y2="29" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="1" stopColor="#A855F7" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}