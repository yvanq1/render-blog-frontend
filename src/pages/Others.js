import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/Posts/PostCard';
import Pagination from '../components/Pagination';
import SortButton from '../components/UI/SortButton';

const Others = () => {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const postsPerPage = 9;
  const excludedCategories = ['sd', 'comfyui', 'mj'];

  // 获取文章列表
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/articles', {
        params: {
          tag: selectedTag,
          search: searchParams.get('search')
        }
      });
      
      if (response.data.success) {
        const { items = [] } = response.data.data;
        // 过滤掉特定分类的文章
        const filteredPosts = items.filter(post => 
          !excludedCategories.includes(post.category?.toLowerCase())
        );
        setPosts(filteredPosts);
      }
    } catch (error) {
      console.error('获取文章列表失败:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // 对文章进行排序和分页
  const sortedAndPaginatedPosts = useMemo(() => {
    let sortedPosts = [...posts];
    
    // 根据排序类型对文章进行排序
    switch (sortBy) {
      case 'newest':
        sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        sortedPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'mostViewed':
        sortedPosts.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'leastViewed':
        sortedPosts.sort((a, b) => (a.views || 0) - (b.views || 0));
        break;
      default:
        break;
    }

    // 计算总页数
    const total = sortedPosts.length;
    setTotalPages(Math.max(1, Math.ceil(total / postsPerPage)));

    // 返回当前页的文章
    const startIndex = (currentPage - 1) * postsPerPage;
    return sortedPosts.slice(startIndex, startIndex + postsPerPage);
  }, [posts, currentPage, sortBy]);

  useEffect(() => {
    fetchPosts();
  }, [selectedTag, searchParams]);

  useEffect(() => {
    fetchTags();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? null : tag);
    setCurrentPage(1);
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    setCurrentPage(1);
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/articles/tags');
      if (response.data.success) {
        setTags(response.data.data);
      }
    } catch (error) {
      console.error('获取标签列表失败:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-morandi-beige/70 via-morandi-rose/50 to-morandi-blue/60 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          其他文章
        </h1>

        {/* 标签列表 */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-indigo-500">
              <path fillRule="evenodd" d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39.92 3.31 0l4.318-4.319a2.25 2.25 0 000-3.183L11.12 5.55A3 3 0 009 4.672V2.25H5.25zM4.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
            </svg>
            标签筛选
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${selectedTag === tag
                    ? 'bg-indigo-500 text-white dark:bg-indigo-600 shadow-md hover:bg-indigo-600'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-800/40 hover:shadow-sm'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 文章列表 */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
          </div>
        ) : sortedAndPaginatedPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedAndPaginatedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">暂无相关文章</p>
          </div>
        )}
      </div>
      <SortButton onSort={handleSort} />
    </div>
  );
};

export default Others;