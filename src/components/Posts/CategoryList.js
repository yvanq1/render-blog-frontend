import React, { useState, useEffect } from 'react';
import { postService } from '../../services/postService';
import Link from 'next/link';
import ChevronRightIcon from '../icons/ChevronRightIcon';

const CategoryList = ({ selectedCategory, onSelectCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await postService.getCategories();
        if (response.success) {
          setCategories([
            { path: '/', name: 'All Categories', icon: null },
            ...response.data.map(category => ({ path: `/${category}`, name: category, icon: null })),
          ]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const isActive = path => path === selectedCategory;

  return (
    <div className="space-y-2">
      {categories.map(category => (
        <Link
          key={category.path}
          to={category.path}
          className={`flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200
            ${isActive(category.path)
              ? 'bg-indigo-500 text-white dark:bg-indigo-600'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
        >
          <div className="flex items-center space-x-3">
            {category.icon && (
              <category.icon
                className={`w-5 h-5 ${
                  isActive(category.path)
                    ? 'text-white'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              />
            )}
            <span className="font-medium">{category.name}</span>
          </div>
          {isActive(category.path) && (
            <ChevronRightIcon className="w-5 h-5 text-white" />
          )}
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
