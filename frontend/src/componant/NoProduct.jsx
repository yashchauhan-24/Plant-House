import React from 'react'
import '../componentStyles/NoProducts.css'
function NoProduct({keyword}) {
  return (

<div className="flex items-center justify-center px-4 py-20">
  <div className="flex flex-col items-center gap-5 text-center max-w-sm">

    {/* Icon Box */}
    <div className="w-20 h-20 rounded-2xl bg-[#03541e]/10 border border-[#03541e]/20 flex items-center justify-center shadow-lg shadow-[#03541e]/10">
      <svg className="w-9 h-9 text-[#03541e]/60" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803zM13.5 10.5h-6" />
      </svg>
    </div>

    {/* Text */}
    <div className="flex flex-col gap-2">
      <h3 className="text-xl font-bold text-[#12351f] tracking-tight">
        No Product Found
      </h3>
      <p className="text-sm text-[#6B4C36] leading-relaxed">
        {keyword
          ? `We couldn't find any product matching "${keyword}"`
          : "No products are available at the moment."}
      </p>
    </div>

    {/* Decorative divider */}
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-px bg-[#03541e]/20" />
      <div className="w-1.5 h-1.5 rotate-45 bg-[#03541e]/30 flex-shrink-0" />
      <div className="flex-1 h-px bg-[#03541e]/20" />
    </div>

    {/* Hint */}
    <p className="text-xs text-[#55705f]">
      Try searching with a different keyword or browse all plants.
    </p>

  </div>
</div>
  )
}   
export default NoProduct
