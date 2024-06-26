import { navbar } from 'vuepress-theme-hope';

export const zhNavbar = navbar([
  '/',
  {
    text: '大前端',
    prefix: '/web',
    children: ['/axiom', '/Css/', '/JavaScript/', '/Project', '/TypeScript', '/Vue', '/React', '/面经', '/Android']
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
    text: 'Vercel项目',
    children: [
      {
        text: 'Next-Notes',
        link: 'https://next-react-notes-six.vercel.app/'
      }
    ]
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
