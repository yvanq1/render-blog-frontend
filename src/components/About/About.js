import React from 'react';

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-morandi-beige/70 via-morandi-rose/50 to-morandi-blue/60 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="relative h-48 bg-indigo-600">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="pt-16 pb-8 px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">壁花</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">AI 艺术创作者 & 技术爱好者</p>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              热衷于探索人工智能与创意表达的交汇点。专注于各种 AI 绘图工具，包括 Stable Diffusion、Midjourney 和 ComfyUI。
            </p>
          </div>
        </div>

        {/* Skills & Expertise */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">AI 艺术平台</h3>
            <div className="space-y-4">
              {[
                { name: 'Stable Diffusion', level: '70%' },
                { name: 'Midjourney', level: '90%' },
                { name: 'ComfyUI', level: '85%' },
                { name: 'DALL-E', level: '50%' },
              ].map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                    <span className="text-gray-500 dark:text-gray-400">{skill.level}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div
                      className="h-2 bg-indigo-600 dark:bg-indigo-500 rounded-full"
                      style={{ width: skill.level }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">专长</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                '人像生成',
                '风景设计',
                '角色创作',
                '风格转换',
                '提示工程',
                '图像合成',
                '色彩理论',
                '数字艺术',
              ].map((specialty) => (
                <div
                  key={specialty}
                  className="bg-indigo-50 dark:bg-indigo-900 rounded-lg px-4 py-2 text-indigo-600 dark:text-indigo-300 text-sm font-medium"
                >
                  {specialty}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">联系我</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            欢迎联系我，讨论 AI 艺术或其他话题！
          </p>
          <div className="flex justify-center space-x-4">
            {[
              { name: 'Twitter', href: '#', icon: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' },
              { name: 'GitHub', href: '#', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
              { name: 'LinkedIn', href: '#', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="text-gray-400 dark:text-gray-200 hover:text-indigo-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">{social.name}</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d={social.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
