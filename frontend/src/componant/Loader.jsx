import React from 'react'
import '../componentStyles/Loader.css'
function Loader() {
  return (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f4fbf6]/90 backdrop-blur-sm">
  <div className="flex flex-col items-center gap-5">

    {/* Spinner Ring */}
    <div className="relative w-16 h-16">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-[#d7eadb]" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#03541e] border-r-[#03541e]/40 animate-spin" />
      {/* Inner pulsing dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-[#03541e] animate-pulse shadow-lg shadow-[#03541e]/60" />
      </div>
    </div>

    {/* Brand + dots */}
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm font-bold tracking-widest uppercase text-[#12351f]">
        Plant<span className="text-[#03541e]"> House</span>
      </p>
      {/* Bouncing dots */}
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#03541e]/60"
            style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>

  </div>

  <style>{`
    @keyframes bounce {
      0%, 100% { transform: translateY(0);   opacity: 0.4; }
      50%       { transform: translateY(-6px); opacity: 1;   }
    }
  `}</style>
</div>
  )
}
export default Loader
