import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/": [
    "",
    {
      text: "web",
      icon: "book",
      prefix: "web/",
      children: "structure",
    },
    {
      text: "算法",
      icon: "book",
      prefix: "algorithm/",
      children: "structure",
    },
    {
      text: "客户端",
      icon: "book",
      prefix: "client/",
      children: "structure",
    },
    {
      text: "服务端",
      icon: "book",
      prefix: "serve/",
      children: "structure",
    },
    {
      text: "Linux",
      icon: "book",
      prefix: "Linux/",
      children: "structure",
    },
    // "slides",
    {
      text: "备忘",
      icon: "book",
      prefix: "others/",
      children: "structure",
    },
  ],
});
