export const mockCarouselPosts = [
  {
    id: 1,
    title: '2024年Web开发趋势展望',
    summary: '探索新的Web技术趋势，包括AI驱动的开发工具、WebAssembly的崛起等。',
    cover: 'https://picsum.photos/1200/400?random=1',
    author: {
      name: '张三',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1'
    },
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: '全栈开发者的必备技能',
    summary: '从前端到后端，探讨现代全栈开发所需的核心技能和最佳实践。',
    cover: 'https://picsum.photos/1200/400?random=2',
    author: {
      name: '李四',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2'
    },
    createdAt: '2024-01-14'
  },
  {
    id: 3,
    title: '构建高性能Web应用',
    summary: '深入探讨提升Web应用性能的关键技术和优化策略。',
    cover: 'https://picsum.photos/1200/400?random=3',
    author: {
      name: '王五',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3'
    },
    createdAt: '2024-01-13'
  }
];

export const mockPosts = [
  {
    id: 1,
    title: 'React性能优化实践',
    summary: '探索React应用性能优化的各种技巧和最佳实践。',
    cover: 'https://picsum.photos/800/400?random=4',
    tags: ['React', 'Performance', 'JavaScript'],
    author: {
      name: '张三',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1'
    },
    createdAt: '2024-01-15',
    views: 1200
  },
  {
    id: 2,
    title: 'TypeScript高级特性详解',
    summary: '深入理解TypeScript的高级类型系统和实用技巧。',
    cover: 'https://picsum.photos/800/400?random=5',
    tags: ['TypeScript', 'JavaScript'],
    author: {
      name: '李四',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2'
    },
    createdAt: '2024-01-14',
    views: 980
  },
  {
    id: 3,
    title: 'Node.js微服务架构',
    summary: '使用Node.js构建可扩展的微服务架构系统。',
    cover: 'https://picsum.photos/800/400?random=6',
    tags: ['Node.js', 'Microservices'],
    author: {
      name: '王五',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3'
    },
    createdAt: '2024-01-13',
    views: 856
  }
];

export const mockTags = [
  { id: 1, name: 'JavaScript', count: 128 },
  { id: 2, name: 'React', count: 96 },
  { id: 3, name: 'Node.js', count: 84 },
  { id: 4, name: 'TypeScript', count: 76 },
  { id: 5, name: 'Vue.js', count: 68 },
  { id: 6, name: 'Python', count: 62 },
  { id: 7, name: 'Docker', count: 54 },
  { id: 8, name: 'MongoDB', count: 48 },
  { id: 9, name: 'AWS', count: 42 },
  { id: 10, name: 'GraphQL', count: 38 }
];
