import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const postService = {
  // 获取所有文章
  async getPosts(params = {}) {
    const { page = 1, limit = 9, category, tag } = params;
    const response = await axios.get(`${API_URL}/articles`, {
      params: {
        page,
        limit,
        category,
        tag
      }
    });
    return response.data;
  },

  // 获取单篇文章详情
  async getPostById(id) {
    const response = await axios.get(`${API_URL}/articles/${id}`);
    return response.data;
  },

  // 获取热门文章
  async getPopularPosts() {
    const response = await axios.get(`${API_URL}/articles/popular`);
    return response.data;
  },

  // 获取所有分类
  async getCategories() {
    const response = await axios.get(`${API_URL}/articles/categories`);
    return response.data;
  },

  // 获取所有标签
  async getTags() {
    const response = await axios.get(`${API_URL}/articles/tags`);
    return response.data;
  },

  // 增加文章浏览量
  async incrementViews(postId) {
    const response = await axios.post(`${API_URL}/articles/${postId}/views`);
    return response.data;
  }
};
