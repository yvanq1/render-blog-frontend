import React, { useState } from 'react';

const SortButton = ({ onSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState('newest');

  const sortOptions = [
    { 
      id: 'newest', 
      label: '最新',
      description: '按发布时间降序',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 4h18M3 12h13M3 20h8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    { 
      id: 'oldest', 
      label: '最早',
      description: '按发布时间升序',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 4h8M3 12h13M3 20h18" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    { 
      id: 'mostViewed', 
      label: '最多浏览',
      description: '按浏览量降序',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    { 
      id: 'leastViewed', 
      label: '最少浏览',
      description: '按浏览量升序',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
        </svg>
      )
    }
  ];

  const handleSort = (sortId) => {
    setCurrentSort(sortId);
    onSort(sortId);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-1/2 right-6 transform -translate-y-1/2 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-indigo-500 text-white rounded-full p-3 shadow-lg hover:bg-indigo-600 transition-colors duration-200"
          title="排序选项"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 4h18M3 12h13M3 20h8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSort(option.id)}
                className={`w-full px-4 py-3 text-left flex items-center space-x-3 ${
                  currentSort === option.id
                    ? 'text-indigo-500 dark:text-indigo-400 bg-gray-100 dark:bg-gray-700'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                } first:rounded-t-lg last:rounded-b-lg transition-colors duration-200`}
                title={option.description}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SortButton;
