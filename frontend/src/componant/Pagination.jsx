import React from "react";
import "../componentStyles/Pagination.css";
import { useSelector } from "react-redux";

function Pagination({
  currentPage,
  onPageChange,
  activeClass = "active",
  nextPageteText = "Next",
  lastPageText = "Last",
  firstPageText = "1st",
  prevPageText = "Prev",
}) {
  const { totalPages, products } = useSelector((state) => state.product);
  // No product or page only 1
  if (products.length === 0 || totalPages <= 1) return null;

  // generate page number
  const getPageNumbers = () => {
    // pagination number sotore
    const PageNumbers = [];
    // pgn. show before and after page 
    const pageWindow = 2;

    for (let i = Math.max(1, currentPage - pageWindow);
      i <= Math.min(totalPages, currentPage + pageWindow);
      i++) 
    {
      PageNumbers.push(i);
    }
    return PageNumbers;
  };
  return (
 <div className="flex items-center justify-center gap-2 my-8 font-sans">
  {currentPage > 1 && (
    <>
      <button 
        className="flex items-center justify-center h-10 px-4 rounded-xl font-semibold text-sm transition-all duration-200 border border-[#d7eadb] bg-[#ffffff] text-[#12351f] hover:bg-[#03541e]/10 hover:text-[#03541e] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#03541e]/20" 
        onClick={() => onPageChange(1)}
      >
        {firstPageText}
      </button>
      <button 
        className="flex items-center justify-center h-10 px-4 rounded-xl font-semibold text-sm transition-all duration-200 border border-[#d7eadb] bg-[#ffffff] text-[#12351f] hover:bg-[#03541e]/10 hover:text-[#03541e] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#03541e]/20"
        onClick={() => onPageChange(currentPage - 1)}
      >
        {prevPageText}
      </button>
    </>
  )}

  {/* Page Number */}
  {getPageNumbers().map((number) => (
    <button
      className={`flex items-center justify-center min-w-[2.5rem] h-10 px-2 rounded-xl font-bold text-sm transition-all duration-200 border border-[#d7eadb] bg-[#ffffff] text-[#12351f] hover:bg-[#03541e]/10 hover:text-[#03541e] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#03541e]/20 ${
        currentPage === number ? ' ' + activeClass : ''
      }`}
      key={number}
      onClick={() => onPageChange(number)}
    >
      {number}
    </button>
  ))}

  {/* next and last btn */}
  {currentPage < totalPages && (
    <>
      <button 
        className="flex items-center justify-center h-10 px-4 rounded-xl font-semibold text-sm transition-all duration-200 border border-[#d7eadb] bg-[#ffffff] text-[#12351f] hover:bg-[#03541e]/10 hover:text-[#03541e] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#03541e]/20"
        onClick={() => onPageChange(currentPage + 1)}
      >
        {nextPageteText}
      </button>
      <button
        className="flex items-center justify-center h-10 px-4 rounded-xl font-semibold text-sm transition-all duration-200 border border-[#d7eadb] bg-[#ffffff] text-[#12351f] hover:bg-[#03541e]/10 hover:text-[#03541e] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#03541e]/20"
        onClick={() => onPageChange(totalPages)}
      >
        {lastPageText}
      </button>
    </>
  )}
</div>
  );
}

export default Pagination;
