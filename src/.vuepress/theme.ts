import { hopeTheme } from 'vuepress-theme-hope';
import { zhNavbar } from './navbar/index.js';
import { zhSidebar } from './sidebar/index.js';

export default hopeTheme({
  // 域名
  hostname: 'https://www.huangxi.cc',
  // 文章显示的默认作者
  author: {
    name: '黄曦',
    url: 'https://www.huangxi.cc',
    email: 'huangxi0226@163.com'
  },
  // darkmode
  darkmode: 'toggle',
  // 全屏启用
  fullscreen: true,
  // 支持打印
  print: true,

  iconAssets: ['fontawesome-with-brands'],
  // 站点图标
  logo: 'logo.webp',
  // 仓库链接
  repo: 'https://github.com/huangxi-184/hx-docs',

  // 完成热重启.开启后,白屏时间加长.
  hotReload: false,

  docsDir: 'src',

  locales: {
    '/': {
      // navbar
      navbar: zhNavbar,

      // sidebar
      sidebar: zhSidebar,

      footer: '<a href="https://beian.miit.gov.cn" target="_blank">皖ICP备2023015050号-1</a>',

      displayFooter: true,
      // page meta
      metaLocales: {
        editLink: '有错误请联系小白修改哟~'
      }
    }
  },

  encrypt: {
    config: {
      '/demo/encrypt.html': ['1842196429']
    }
  },

  plugins: {
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      demo: true,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ['ts', 'vue']
      },
      presentation: ['highlight', 'math', 'search', 'notes', 'zoom'],
      stylize: [
        {
          matcher: 'Recommended',
          replacer: ({ tag }) => {
            if (tag === 'em')
              return {
                tag: 'Badge',
                attrs: { type: 'tip' },
                content: 'Recommended'
              };
          }
        }
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true
    }
  }
});
