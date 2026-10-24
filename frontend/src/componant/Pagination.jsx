import React from "react";
import "../componentStyles/Pagination.css";
import { useSelector } from "react-redux";

function Pagination({
  currentPage,
  onPageChange,
}) {
  const { totalPages } = useSelector((state) => state.product);
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
 <div className="pagination">
  <button className="pagination-btn pagination-wide" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>← Prev</button>
  {pageNumbers.map((number) => (
    <button className={`pagination-btn ${currentPage === number ? "active" : ""}`} key={number} onClick={() => onPageChange(number)}>{number}</button>
  ))}
  <button className="pagination-btn pagination-wide" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>Next →</button>
</div>
  );
}

export default Pagination;
