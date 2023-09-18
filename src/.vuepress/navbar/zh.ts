import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
  {
    text: "笔记",
    icon: "book",
    prefix: "/notes",
    children: [{
      text: "Android",
      icon: "book",
      prefix: "/Android",
      children: [""]
    },
    {
      text: "dataBase",
      icon: "book",
      prefix: "/dataBase",
      children: [""]
    },
    {
      text: "css",
      icon: "book",
      prefix: "/css",
      children: [""]
    },
    {
      text: "JavaScript",
      icon: "book",
      prefix: "/JavaScript",
      children: [""]
    },
    {
      text: "vue",
      icon: "book",
      prefix: "/Vue",
      children: [""]
    },
    {
      text: "部署",
      icon: "book",
      prefix: "/Linux",
      children: [""]
    },
    {
      text: "project",
      icon: "book",
      prefix: "/project",
      children: [""]
    },
    {
      text: "Python",
      icon: "book",
      prefix: "/Python",
      children: [""]
    },
      "/README.md"
    ]
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
