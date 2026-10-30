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
      // —— 保留：实际在用的 ——
      align: true,
      attrs: true,
      figure: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      katex: true, // serve/dataBase/sql.md 有一处行内公式 $A∩B$
      mark: true,
      mermaid: true, // serve/Python/ragflowDeply.md 有一处流程图
      sub: true,
      sup: true,
      vPre: true

      // —— 关闭：全站 0 处使用，且会引入大体积依赖（2026-10-30 实测）——
      // chart / echarts     → 0 处 ::: echarts / ::: chart 容器
      // flowchart           → 0 处，且会打包 flowchart-elk 布局器（1.3MB）
      // presentation        → 0 处，且会引入 reveal.js + 约 1MB 字体
      // playground          → 0 处，且会引入 vue-repl + codemirror（约 1.2MB）
      // vuePlayground       → 0 处
      // demo                → 0 处 ::: demo 容器
      // tabs / codetabs     → 0 处 ::: tabs 容器
      // include             → 0 处 @include()
      // stylize             → 0 处 *Recommended*
      // chart: true,
      // codetabs: true,
      // demo: true,
      // echarts: true,
      // flowchart: true,
      // include: true,
      // playground: { presets: ['ts', 'vue'] },
      // presentation: ['highlight', 'math', 'search', 'notes', 'zoom'],
      // stylize: [...],
      // tabs: true,
      // vuePlayground: true
    }
  }
});
