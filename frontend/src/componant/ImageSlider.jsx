import React, { useEffect, useState } from "react";
import "../componentStyles/ImageSlider.css";

const slides = [
  { image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1600&q=85", title: "Bring life to your space.", description: "Fresh indoor plants, thoughtful care and a greener everyday." },
  { image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1600&q=85", title: "Grow something beautiful.", description: "Plants chosen to make every room feel more alive." },
  { image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=85", title: "A greener everyday.", description: "Thoughtful plants and simple care for your home." },
];
function ImageSlider() {
    const [currentIndex, setCurrentIndx]=useState(0)
    useEffect(()=>{
        const interval = setInterval(()=>{
            // value in currentIndex is now in preIndex
            setCurrentIndx((preIndex)=>(preIndex+1) % slides.length)
        }, 5000)
        return ()=>clearInterval(interval)
    },[])
  return (
   

<div className="plant-hero mt-25 relative w-full overflow-hidden rounded-2xl border border-[#03541e]/25 shadow-2xl shadow-[#03541e]/20">

  {/* Slides */}
  <div
    className="flex transition-transform duration-500 ease-in-out"
    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
  >
    {slides.map((slide, index) => (
      <div
        className="min-w-full relative"
        key={index}
      >
        <img
          src={slide.image}
          alt="Indoor plants for your home"
          className="w-full h-full object-cover"
        />
        {/* Subtle amber overlay on bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#03541e]/60 via-transparent to-transparent pointer-events-none" />
      </div>
    ))}
  </div>

  <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center px-7 sm:px-12 text-white pointer-events-none">
    <span className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#adf0be]">Plant House</span>
    <h1 className="text-3xl font-bold leading-tight sm:text-5xl">{slides[currentIndex].title}</h1>
    <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/85 sm:text-base">{slides[currentIndex].description}</p>
  </div>

  {/* Slide Counter Badge */}
  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#03541e]/70 backdrop-blur-sm border border-[#03541e]/25 text-xs font-semibold text-[#d7eadb]">
    {currentIndex + 1} / {slides.length}
  </div>

  {/* Dots */}
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
    {slides.map((_, i) => (
      <button
        type="button"
        aria-label={`Show hero slide ${i + 1}`}
        key={i}
        onClick={() => setCurrentIndx(i)}
        className={`cursor-pointer transition-all duration-300 rounded-full
          ${i === currentIndex
            ? "w-6 h-2 bg-[#03541e] shadow-lg shadow-[#03541e]/40"
            : "w-2 h-2 bg-[#55705f] hover:bg-[#d7eadb]"
          }`}
      />
    ))}
  </div>

</div>
  );
}

export default ImageSlider;
