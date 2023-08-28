import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/": [
    "",
    {
      text: "笔记",
      icon: "book",
      prefix: "notes/",
      children: "structure",
    },
    "slides",
  ],
});
