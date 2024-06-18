import { navbar } from 'vuepress-theme-hope';

export const zhNavbar = navbar([
  '/',
  {
    text: 'Web',
    prefix: '/web',
    children: [
      {
        text: '开发常识',
        prefix: '/axiom/',
        activeMatch: '^/web/axiom/$',
        children: ['git', 'Markdown', 'naming-conventions']
      },
      {
        text: 'CSS',
        prefix: '/css/',
        children: ['grid', 'rem', 'tailwindCSS']
      },
      {
        text: 'js',
        prefix: '/JS/',
        children: ['es7', 'es8', 'es9', 'es10', 'es11', 'es12', 'promise']
      },
      {
        text: 'Project',
        prefix: '/Project/',

        children: [
          'funCode/复杂表格',
          'funCode/获得摄像头的数据流',
          'funCode/图片转CSS',
          'tinymce/index',
          'vbenAdmin/i18n',
          'vbenAdmin/tableCom',
          'vbenAdmin/tips',
          '数据大屏',
          'chrome'
        ]
      },
      {
        text: 'TypeScript',
        prefix: '/TS/',
        children: ['ts入门']
      },
      {
        text: 'Vue',
        prefix: '/Vue/',
        children: ['组件通信方式', 'HTTP状态码', 'NuxtJs', 'vue总结']
      },
      {
        text: 'React',
        prefix: '/React/',
        children: ['描述UI']
      },
      {
        text: '面经',
        prefix: '/interview/',
        children: ['01', '02']
      }
    ]
  },
  {
    text: '客户端',
    prefix: '/client/',
    children: [
      {
        text: 'Android',
        prefix: 'Android/',
        children: ['androidbase']
      }
    ]
  },
  {
    text: '服务端',
    prefix: '/serve/',
    children: [
      {
        text: '数据库',
        prefix: 'dataBase/',
        children: ['sql', 'quickQuery']
      },
      {
        text: 'Python',
        prefix: 'Python/',
        children: ['python']
      },
      {
        text: 'Koa',
        prefix: 'Koa/',
        children: ['Koa']
      },
      {
        text: 'Nest',
        prefix: 'NestJs/',
        children: ['nest学习(一)', '全局模块和生命周期', '一网打尽 Nest 全部装饰器']
      }
    ]
  },
  {
    text: '运维',
    prefix: '/Linux/',
    children: ['nginx', 'nginx_use', 'pm2', 'docker']
  },
  {
    text: '算法',
    prefix: '/algorithm/',
    children: [
      {
        text: '力扣',
        prefix: 'Leetcode/',
        children: ['study_01']
      }
    ]
  },
  {
    text: '备忘录',
    prefix: '/others/',
    children: ['PMS开通账号']
  },
  {
    text: '常用链接',
    children: [
      {
        text: 'vuejs',
        link: 'https://cn.vuejs.org/'
      },
      {
        text: 'theme-hope',
        link: 'https://theme-hope.vuejs.press/zh/'
      }
    ]
  }
]);
