import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
  {
    text: "Web",
    icon: "book",
    prefix: "/web",
    children: [
      "/git.md",
      "/Markdown.md",
      "/naming-conventions.md",
      {
        text: "css",
        icon: "book",
        prefix: "/css/",
        children: ["grid.md", "rem.md", "tailwindCSS.md"]
      },
      {
        text: "JavaScript",
        icon: "book",
        prefix: "/JavaScript/",
        children: ["es7.md", "es8.md", "es9.md", "es10.md", "es11.md", "es12.md", "promise.md"]
      },
      {
        text: "project",
        icon: "book",
        prefix: "/project",
        children: ["/funCode/复杂表格.md", "/funCode/获得摄像头的数据流.md", "/funCode/图片转CSS.md",
          "/tinymce/index.md", "/vbenAdmin/i18n.md",
          "/vbenAdmin/tableCom.md", "/vbenAdmin/tips.md",
          "/数据大屏.md", "/chrome.md"
        ]
      },
      {
        text: "TypeScript",
        icon: "book",
        prefix: "/TypeScript",
        children: ["/ts入门.md"]
      },
      {
        text: "vue",
        icon: "book",
        prefix: "/Vue",
        children: ["/组件通信方式.md", "/HTTP状态码.md", "/NuxtJs.md", "/vue总结.md"]
      },
      {
        text: "React",
        icon: "book",
        prefix: "/React",
        children: ["/描述UI.md"]
      },
      {
        text: "Python",
        icon: "book",
        prefix: "/Python",
        children: ["/python.md"]
      },
    ]
  },
  {
    text: "客户端",
    icon: "book",
    prefix: "/client/",
    children: [{
      text: "Android",
      icon: "book",
      prefix: "Android/",
      children: ["androidbase"]
    }]
  },
  {
    text: "服务端",
    icon: "book",
    prefix: "/serve/",
    children: [{
      text: "数据库",
      icon: "book",
      prefix: "dataBase/",
      children: ["sql.md","quickQuery.md"]
    },
    {
      text: "Java",
      icon: "book",
      prefix: "Java/",
      children: []
    },
    {
      text: "Node",
      icon: "book",
      prefix: "Node/",
      children: ["nest学习(一).md", "全局模块和生命周期.md", "一网打尽 Nest 全部装饰器.md", "Koa.md"]
    }]
  },
  {
    text: "Linux",
    icon: "book",
    prefix: "/Linux",
    children: ["/nginx.md", "/pm2.md",'/docker.md']
  },
  {
    text: "刷题",
    icon: "book",
    prefix: "/algorithm/",
    children: [{
      text: "力扣",
      icon: "book",
      prefix: "Leetcode/",
      children: ["study_01.md"]
    }]
  },
  {
    text: "备忘",
    icon: "book",
    prefix: "/others/",
    children: ["PMS开通账号.md"]
  },
  {
    text: "常用链接",
    icon: "book",
    children: [
      {
        text: "vuejs",
        icon: "book",
        link: "https://cn.vuejs.org/",
      },
      {
        text: "spring-boot",
        icon: "book",
        link: "https://springref.com/projects/spring-boot",
      },
      {
        text: "lodash",
        icon: "book",
        link: "https://www.lodashjs.com/",
      },
      {
        text: "theme-hope",
        icon: "book",
        link: "https://theme-hope.vuejs.press/zh/",
      },
    ],
  },
]);
