import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ClockIcon, EyeIcon, TagIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Markdown from 'markdown-to-jsx';
import { toast } from 'react-hot-toast';
import { API_URL } from '../config/api';

// 解析markdown内容中的标题
const extractHeadings = (content) => {
  const headings = [];
  const lines = content.split('\n');
  let id = 0;

  lines.forEach((line) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      const slug = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      headings.push({
        id: `heading-${id++}`,
        level,
        text,
        slug
      });
    }
  });

  return headings;
};

const TableOfContents = ({ headings, activeId }) => {
  if (headings.length === 0) return null;

  return (
    <nav className="hidden lg:block fixed left-8 top-1/4 w-64 max-h-[60vh] overflow-y-auto 
                    p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-2
                    scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">目录</h2>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
          >
            <a
              href={`#${heading.slug}`}
              className={`block py-1 text-sm transition-colors duration-200 
                        hover:text-indigo-600 dark:hover:text-indigo-400
                        ${activeId === heading.slug
                          ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400'
                        }`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(heading.slug);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const viewCountUpdated = useRef(false);  // 添加ref来跟踪浏览量是否已更新
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState('');

  // 获取收藏状态
  const fetchFavoriteStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/favorites/status/${id}`, {
        withCredentials: true
      });
      if (response.data.success) {
        setIsFavorited(response.data.data.isFavorited);
      }
    } catch (error) {
      // 如果是未登录错误，不显示错误提示
      if (error.response?.status !== 401) {
        console.error('获取收藏状态失败:', error);
      }
    }
  };

  // 获取推荐文章
  const fetchRecommendedPosts = async (currentPost) => {
    try {
      // 检查文章是否有标签
      if (!currentPost.tags || currentPost.tags.length === 0) {
        console.log('当前文章没有标签，无法获取推荐');
        return;
      }

      // 获取所有文章
      const response = await axios.get(`${API_URL}/api/articles`);
      if (response.data.success) {
        const allPosts = response.data.data.items;
        
        // 找出具有相同标签的文章
        const relatedPosts = allPosts.filter(post => 
          post._id !== currentPost._id && // 排除当前文章
          post.tags && // 确保文章有标签
          post.tags.some(tag => currentPost.tags.includes(tag)) // 至少有一个相同的标签
        );

        // 随机打乱数组顺序
        const shuffled = relatedPosts.sort(() => 0.5 - Math.random());
        
        // 取前两篇
        setRecommendedPosts(shuffled.slice(0, 2));
      }
    } catch (error) {
      console.error('获取推荐文章失败:', error);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/articles/${id}`);
        if (response.data.success) {
          console.log('当前文章数据:', response.data.data);
          setPost(response.data.data);
          // 获取文章后，获取收藏状态和推荐文章
          await Promise.all([
            fetchFavoriteStatus(),
            fetchRecommendedPosts(response.data.data)
          ]);
          
          // 更新浏览量（只在第一次加载时更新）
          if (!viewCountUpdated.current) {
            try {
              const viewResponse = await axios.patch(
                `${API_URL}/api/articles/${id}/views`
              );
              if (viewResponse.data.success) {
                // 更新本地文章数据的浏览量
                setPost(prev => ({
                  ...prev,
                  views: viewResponse.data.data.views
                }));
                viewCountUpdated.current = true;  // 标记浏览量已更新
              }
            } catch (viewError) {
              console.error('更新浏览量失败:', viewError);
            }
          }
        } else {
          setError('文章加载失败');
        }
      } catch (error) {
        console.error('获取文章详情失败:', error);
        setError('文章加载失败');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    
    // 组件卸载时重置ref
    return () => {
      viewCountUpdated.current = false;
    };
  }, [id]);

  // 处理收藏/取消收藏
  const handleFavorite = async () => {
    try {
      setFavLoading(true);
      if (isFavorited) {
        // 取消收藏
        const response = await axios.delete(`${API_URL}/api/favorites/${id}`, {
          withCredentials: true
        });
        if (response.data.success) {
          setIsFavorited(false);
          toast.success('取消收藏成功');
        }
      } else {
        // 添加收藏
        const response = await axios.post(`${API_URL}/api/favorites`, {
          articleId: id
        }, {
          withCredentials: true
        });
        if (response.data.success) {
          setIsFavorited(true);
          toast.success('收藏成功');
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('请先登录');
      } else {
        toast.error(isFavorited ? '取消收藏失败' : '收藏失败');
        console.error('收藏操作失败:', error);
      }
    } finally {
      setFavLoading(false);
    }
  };

  // 处理滚动时更新当前活动标题
  useEffect(() => {
    if (!post) return;

    const handleScroll = () => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let currentHeading = '';

      for (const element of headingElements) {
        const rect = element.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
          currentHeading = element.id;
        }
      }

      setActiveHeading(currentHeading);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  // 解析文章内容中的标题
  useEffect(() => {
    if (post?.content) {
      const extractedHeadings = extractHeadings(post.content);
      setHeadings(extractedHeadings);
    }
  }, [post?.content]);

  // 自定义标题渲染，添加id用于导航
  const HeadingRenderer = ({ level, children }) => {
    const text = children[0] || '';
    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const Tag = `h${level}`;
    
    // 根据标题级别返回对应的样式
    const getHeadingStyle = (level) => {
      switch (level) {
        case 1:
          return 'text-4xl font-bold mt-12 mb-8 pb-4 border-b border-gray-200 dark:border-gray-700';
        case 2:
          return 'text-3xl font-bold mt-10 mb-6';
        case 3:
          return 'text-2xl font-bold mt-8 mb-4';
        case 4:
          return 'text-xl font-semibold mt-6 mb-4';
        case 5:
          return 'text-lg font-semibold mt-4 mb-2';
        case 6:
          return 'text-base font-semibold mt-4 mb-2';
        default:
          return '';
      }
    };
    
    return React.createElement(Tag, {
      id: slug,
      className: getHeadingStyle(level)
    }, children);
  };

  // 自定义代码块渲染
  const CodeBlock = ({ children, className }) => {
    const language = className ? className.replace('lang-', '') : '';
    return (
      <pre className={`bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm leading-6 ${className || ''}`}>
        <code className={`language-${language}`}>{children}</code>
      </pre>
    );
  };

  // Markdown 渲染配置
  const markdownOptions = {
    overrides: {
      h1: { component: HeadingRenderer, props: { level: 1 } },
      h2: { component: HeadingRenderer, props: { level: 2 } },
      h3: { component: HeadingRenderer, props: { level: 3 } },
      h4: { component: HeadingRenderer, props: { level: 4 } },
      h5: { component: HeadingRenderer, props: { level: 5 } },
      h6: { component: HeadingRenderer, props: { level: 6 } },
      code: CodeBlock,
      pre: ({ children }) => <>{children}</>,
      a: {
        component: ({ children, ...props }) => (
          <a
            {...props}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
      },
      img: {
        component: ({ alt, ...props }) => (
          <img
            {...props}
            alt={alt}
            className="rounded-lg max-w-full h-auto my-6 mx-auto shadow-lg"
            loading="lazy"
          />
        ),
      },
      p: {
        component: ({ children }) => (
          <p className="mb-6 text-gray-700 dark:text-gray-300 leading-7 text-base">
            {children}
          </p>
        ),
      },
      ul: {
        component: ({ children }) => (
          <ul className="list-disc list-outside mb-6 ml-5 text-gray-700 dark:text-gray-300 space-y-2">
            {children}
          </ul>
        ),
      },
      ol: {
        component: ({ children }) => (
          <ol className="list-decimal list-outside mb-6 ml-5 text-gray-700 dark:text-gray-300 space-y-2">
            {children}
          </ol>
        ),
      },
      li: {
        component: ({ children }) => (
          <li className="leading-7">{children}</li>
        ),
      },
      blockquote: {
        component: ({ children }) => (
          <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-6 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 italic rounded-r">
            {children}
          </blockquote>
        ),
      },
      hr: {
        component: () => (
          <hr className="my-8 border-t border-gray-200 dark:border-gray-700" />
        ),
      },
      table: {
        component: ({ children }) => (
          <div className="overflow-x-auto my-6">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              {children}
            </table>
          </div>
        ),
      },
      th: {
        component: ({ children }) => (
          <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-sm font-semibold text-gray-900 dark:text-white">
            {children}
          </th>
        ),
      },
      td: {
        component: ({ children }) => (
          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
            {children}
          </td>
        ),
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {error || '文章不存在'}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-morandi-beige/70 via-morandi-rose/50 to-morandi-blue/60 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 目录导航 */}
      <TableOfContents headings={headings} activeId={activeHeading} />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 返回按钮 */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 4.158a.75.75 0 11-1.04 1.04l-5.5-5.5a.75.75 0 010-1.04l5.5-5.5a.75.75 0 111.04 1.04L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            返回
          </button>
        </div>

        {/* 文章头部 */}
        <header className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              {post.title}
            </h1>
            <button
              onClick={handleFavorite}
              disabled={favLoading}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                isFavorited
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              {isFavorited ? (
                <HeartIconSolid className="w-6 h-6" />
              ) : (
                <HeartIcon className="w-6 h-6" />
              )}
            </button>
          </div>
          
          {/* 文章元信息：时间、浏览量、分类和标签 */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              <time dateTime={post.createdAt}>
                {new Date(post.createdAt).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <EyeIcon className="h-4 w-4" />
              <span>{post.views || 0} 次浏览</span>
            </div>
            {post.category && (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  {post.category}
                </span>
              </div>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <TagIcon className="h-4 w-4" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* 文章内容 */}
        <article className="prose prose-base md:prose-lg dark:prose-invert prose-headings:scroll-mt-20 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-img:rounded-lg prose-img:shadow-lg max-w-none">
          <Markdown options={markdownOptions}>{post.content}</Markdown>
        </article>

        {/* 推荐文章 */}
        {recommendedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">推荐阅读</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedPosts.map(post => (
                <Link
                  key={post._id}
                  to={`/post/${post._id}`}
                  className="group relative flex bg-indigo-50/50 dark:bg-indigo-500/5 rounded-lg overflow-hidden h-32 hover:shadow-lg hover:-translate-y-1 hover:bg-indigo-50/80 dark:hover:bg-indigo-500/10 transition-all duration-300 ease-out"
                >
                  {/* 文章封面图 */}
                  {post.coverImage && (
                    <div className="w-1/3 relative overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      {/* 遮罩层 */}
                      <div className="absolute inset-0 bg-indigo-900 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    </div>
                  )}
                  {/* 文章信息 */}
                  <div className={`${post.coverImage ? 'w-2/3' : 'w-full'} p-4 flex flex-col justify-between transition-colors duration-300`}>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transform group-hover:-translate-x-1 transition-all duration-300 ease-out line-clamp-1 mb-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300 transform group-hover:-translate-x-1 transition-all duration-300 delay-75 ease-out line-clamp-1">
                        {post.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transform group-hover:-translate-x-1 transition-all duration-300 delay-150 ease-out">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        <time dateTime={post.createdAt}>
                          {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                        </time>
                      </div>
                      {post.category && (
                        <div className="flex items-center gap-1">
                          <TagIcon className="w-3 h-3" />
                          <span>{post.category}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
