import { defineUserConfig } from 'vuepress';
import theme from './theme.js';
import { searchProPlugin } from 'vuepress-plugin-search-pro';
import { registerComponentsPlugin } from '@vuepress/plugin-register-components';
import { getDirname, path } from 'vuepress/utils';
import { viteBundler } from '@vuepress/bundler-vite';

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  base: '/',

  // 单语言设置
  lang: 'zh-CN',

  bundler: viteBundler({
    viteOptions: {},
    vuePluginOptions: {}
  }),

  theme,

  plugins: [
    searchProPlugin({
      // 索引全部内容
      indexContent: true,
      // 为分类和标签添加索引
      customFields: [
        {
          getter: (page) => page.frontmatter.category,
          formatter: '分类：$content'
        },
        {
          getter: (page) => page.frontmatter.tag,
          formatter: '标签：$content'
        }
      ]
    }),

    // 组件注册
    registerComponentsPlugin({
      components: {
        Kanban: path.resolve(__dirname, './components/Kanban.vue')
      }
    })
  ],
  templateDev: path.resolve(__dirname, './templates/dev.html')
  // templateBuild: path.resolve(__dirname, './templates/ssr.html')
});
