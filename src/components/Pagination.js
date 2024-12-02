import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages
    ];
  };

  return (
    <div className="flex items-center justify-center space-x-2 my-12 select-none">
      {/* 上一页按钮 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      {/* 页码按钮 */}
      <div className="flex items-center">
        {getPageNumbers().map((number, index) => (
          <button
            key={index}
            onClick={() => typeof number === 'number' && onPageChange(number)}
            disabled={number === '...'}
            className={`
              min-w-[2.5rem] h-10 mx-0.5 flex items-center justify-center text-sm font-medium
              transition-colors rounded-lg
              ${number === currentPage
                ? 'bg-gray-900 text-white'
                : number === '...'
                  ? 'text-gray-500 cursor-default hover:bg-transparent'
                  : 'text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            {number}
          </button>
        ))}
      </div>

      {/* 下一页按钮 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
