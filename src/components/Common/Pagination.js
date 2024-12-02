import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center space-x-2">
      {/* 上一页按钮 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg transition-all duration-200 ${
          currentPage === 1
            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            : 'text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400'
        }`}
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      {/* 页码按钮 */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            currentPage === page
              ? 'bg-indigo-500 text-white dark:bg-indigo-600'
              : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          {page}
        </button>
      ))}

      {/* 下一页按钮 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg transition-all duration-200 ${
          currentPage === totalPages
            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            : 'text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400'
        }`}
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </nav>
  );
};

export default Pagination;
