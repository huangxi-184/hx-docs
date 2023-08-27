import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
  "/demo/",
  {
    text: "指南",
    icon: "lightbulb",
    prefix: "/guide/",
    children: [
      {
        text: "Bar",
        icon: "lightbulb",
        prefix: "bar/",
        children: ["baz", { text: "...", icon: "ellipsis", link: "" }],
      },
      {
        text: "Foo",
        icon: "lightbulb",
        prefix: "foo/",
        children: ["ray", { text: "...", icon: "ellipsis", link: "" }],
      },
    ],
  },
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
        text: "vuepress",
        icon: "book",
        link: "https://theme-hope.vuejs.press/zh/",
      },
    ],
  },
]);
