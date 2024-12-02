import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, ClockIcon } from '@heroicons/react/24/outline';
import { postService } from '../../services/postService';
import { toast } from 'react-hot-toast';

function FavoritePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await postService.getPopularPosts();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching popular posts:', err);
        setError('Failed to load popular posts');
        toast.error('Failed to load popular posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-4">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400 py-4">
        暂无热门文章
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Link
          key={post.id}
          to={`/posts/${post.id}`}
          className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <article className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                {post.title}
              </h3>
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-20 h-20 object-cover rounded-lg ml-4"
              />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-2">
              {post.description}
            </p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
              <span className="flex items-center">
                <EyeIcon className="h-4 w-4 mr-1" />
                {post.views}
              </span>
              <span className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {post.readTime}
              </span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString()}
              </time>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}

export default FavoritePosts;
