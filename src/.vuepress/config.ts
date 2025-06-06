import { defineUserConfig } from 'vuepress';
import theme from './theme.js';
import { searchProPlugin } from 'vuepress-plugin-search-pro';
import { registerComponentsPlugin } from '@vuepress/plugin-register-components';
import { getDirname, path } from '@vuepress/utils';

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  base: '/',

  // 单语言设置
  lang: 'zh-CN',

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
    registerComponentsPlugin({
      components: {
        ShelfLifeCalculator: path.resolve(__dirname, './components/ShelfLifeCalculator.vue'),
        BilibiliAutumn1BannerComponent: path.resolve(__dirname, './components/bilibili-spring-1-banner.component.vue'),
        DataPanel:path.resolve(__dirname, './components/DataPanel.vue'),
        NcmToMp3:path.resolve(__dirname, './components/NcmToMp3.vue')
      }
    })
  ],
  templateDev: path.resolve(__dirname, './templates/dev.html')
});
