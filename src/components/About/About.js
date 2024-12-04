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
                  src="https://yvanblog.oss-cn-guangzhou.aliyuncs.com/uploads/%E5%A4%B4%E5%83%8F.jpg"
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
              非常开心能够和大家介绍这个完全由AI搭建的博客项目，作为站长AI教程的创作者，相信大家对我也不陌生
              虽然这个博客是我自嗨的产品，但是偶尔也会更新一些有用的AI教程，希望大家能够喜欢
            </p>
          </div>
        </div>

        {/* Skills & Expertise */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">AI 艺术平台</h3>
            <div className="space-y-4">
              {[/* eslint-disable */
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
              {[/* eslint-disable */
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
          <div className="text-gray-600 dark:text-gray-300 space-y-2">
            <p>小红书：对线过敏</p>
            <p>VX：Yquan9835（注明来意）</p>
            <p>公众号：对线AI</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
