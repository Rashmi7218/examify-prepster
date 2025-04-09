
import { useState } from "react";

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

export function usePagination<T>({ 
  totalItems, 
  itemsPerPage, 
  initialPage = 1 
}: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginateItems = (items: T[]): T[] => {
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  return {
    currentPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    handlePageChange,
    paginateItems
  };
}
