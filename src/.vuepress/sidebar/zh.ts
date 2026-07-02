import { sidebar } from 'vuepress-theme-hope';

export const zhSidebar = sidebar({
  '/': [
    '',
    {
      text: 'web',
      icon: 'book',
      prefix: 'web/',
      children: 'structure'
    },
    {
      text: '算法',
      icon: 'book',
      prefix: 'algorithm/',
      children: 'structure'
    },
    {
      text: '服务端',
      icon: 'book',
      prefix: 'serve/',
      children: 'structure'
    },
    {
      text: 'Linux',
      icon: 'book',
      prefix: 'Linux/',
      children: 'structure'
    },
    {
      text: '百宝箱',
      icon: 'book',
      prefix: 'others/',
      children: 'structure'
    },
    {
      text: 'AI',
      icon: 'book',
      prefix: 'AI/',
      children: 'structure'
    }
  ]
});