import React, { useState, useEffect } from 'react';
import { postService } from '../../services/postService';

const TagList = ({ selectedTag, onSelectTag }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await postService.getTags();
        if (response.success) {
          setTags(response.data);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => onSelectTag(tag)}
            className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
              selectedTag === tag
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagList;
