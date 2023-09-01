import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
  {
    text: "笔记",
    icon: "book",
    prefix: "/notes/",
    children: [{
      text: "Android",
      icon: "book",
      prefix: "Android",
      children: [""]
    },
    {
      text: "dataBase",
      icon: "book",
      prefix: "dataBase",
      children: [""]
    },
    {
      text: "JavaScript",
      icon: "book",
      prefix: "JavaScript",
      children: [""]
    },
    {
      text: "部署",
      icon: "book",
      prefix: "Linux",
      children: [""]
    },
    {
      text: "project",
      icon: "book",
      prefix: "project",
      children: [""]
    },
    {
      text: "Python",
      icon: "book",
      prefix: "Python",
      children: [""]
    },
      "README.md"
    ]
  },
  {
    text: "常用文档",
    icon: "book",
    prefix: "/docs",
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
  {
    text: "其他",
    icon: "book",
    prefix: "/others/",
    children: ["PMS开通账号.md"]
  },
]);
