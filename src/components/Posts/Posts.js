import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PostCard from './PostCard';
import Carousel from './Carousel';
import Pagination from '../Common/Pagination';
import SortButton from '../UI/SortButton';

const Posts = () => {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [carouselPosts, setCarouselPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const postsPerPage = 12;

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
        setPosts(items);
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
    fetchCarouselPosts();
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

  const fetchCarouselPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/banners');
      if (response.data.success) {
        console.log('Banner data:', response.data.data);
        const banners = response.data.data.map(banner => {
          console.log('Processing banner:', banner);
          return {
            _id: banner._id || banner.id || `banner-${Date.now()}-${Math.random()}`,
            title: banner.title,
            description: banner.description,
            coverImage: banner.imageUrl,
            link: banner.link
          };
        });
        console.log('Processed banners:', banners);
        setCarouselPosts(banners);
      }
    } catch (error) {
      console.error('获取轮播图数据失败:', error);
      setCarouselPosts([]);
    }
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

  const handleSort = (sortType) => {
    setSortBy(sortType);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-morandi-beige/70 via-morandi-rose/50 to-morandi-blue/60 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      {/* 热门文章轮播 */}
      <div className="pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* AI绘图标语 */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              全部文章
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              让创意自由流动，让想象化为现实
            </p>
          </div>
          <Carousel posts={carouselPosts} />
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 标签列表 */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 text-indigo-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
            热门标签
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
                <PostCard key={post._id} post={post} />
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
            <p className="text-gray-500 dark:text-gray-400">暂无文章</p>
          </div>
        )}
      </div>

      {/* 排序按钮 */}
      <SortButton onSort={handleSort} />
    </div>
  );
};

export default Posts;
