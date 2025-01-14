import { navbar } from 'vuepress-theme-hope';

export const zhNavbar = navbar([
  '/',
  {
    text: '大前端',
    prefix: '/web/',
    children: [
      '/web/axiom/',
      '/web/css/',
      '/web/JavaScript/',
      '/web/project/',
      '/web/小程序/',
      '/web/TypeScript/',
      '/web/vue/',
      '/web/React/',
      '/web/面经/',
      '/web/Android/'
    ]
  },
  {
    text: '服务端',
    prefix: '/serve/',
    children: [
      {
        text: '数据库',
        prefix: '/serve/dataBase/',
        children: ['/serve/dataBase/sql', '/serve/dataBase/quickQuery']
      },
      {
        text: 'Python',
        prefix: '/serve/Python/',
        children: ['/serve/Python/python']
      },
      {
        text: 'Koa',
        prefix: '/serve/Koa/',
        children: ['/serve/Koa/Koa']
      },
      {
        text: 'Nest',
        prefix: '/serve/NestJs/',
        children: [
          '/serve/NestJs/nest学习(一)',
          '/serve/NestJs/全局模块和生命周期',
          '/serve/NestJs/一网打尽 Nest 全部装饰器'
        ]
      }
    ]
  },
  {
    text: '运维',
    prefix: '/Linux/',
    children: ['/Linux/nginx', '/Linux/nginx_use', '/Linux/pm2', '/Linux/docker']
  },
  {
    text: '算法',
    prefix: '/algorithm/',
    children: [
      {
        text: '力扣',
        prefix: '/algorithm/Leetcode/',
        children: ['/algorithm/Leetcode/study_01']
      }
    ]
  },
  {
    text: '备忘录',
    prefix: '/others/',
    children: ['/others/PMS开通账号']
  },
  {
    text: 'Vercel项目',
    prefix: '/iframe/',
    children: ['/iframe/next-notes']
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
