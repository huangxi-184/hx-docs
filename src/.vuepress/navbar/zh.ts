import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
  {
    text: "常用文档",
    icon: "book",
    prefix: "/docs/",
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
