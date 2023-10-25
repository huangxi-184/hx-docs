---
title: 图片转CSS
shortTitle: 图片转CSS
icon: fab fa-markdown
order: 1
isOriginal: false
date: 2023-02-06
category:
  - 图片转CSS
tag:
  - CSS
---

::: [normal]-demo 图片转CSS

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <input type="file" id="upload" />
    <div id="app"></div>
  </body>
  <script>
    const upload = document.getElementById("upload");
    const app = document.getElementById("app");

    upload.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const filePath = URL.createObjectURL(file);
      const img = await loadImg(filePath);
      const imgPositionInfo = getImgPositionInfo(img);
      const shadows = createHtml(img.width, img.height, imgPositionInfo);
      app.style.boxShadow = shadows;
    };

    function loadImg(filePath) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = filePath;
        img.onload = () => resolve(img);
        img.onerror = () => reject(null);
      });
    }

    function getImgPositionInfo(img) {
      const cvs = document.createElement("canvas");
      ({ width: cvs.width, height: cvs.height } = img);
      const ctx = cvs.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imgPositionInfo = ctx.getImageData(
        0,
        0,
        img.width,
        img.height
      ).data;
      return imgPositionInfo;
    }

    function createHtml(width, height, imgPositionInfo) {
      const cacheShadowCssFragments = [];
      const shadowCssHover = [];
      for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
          const i = r * width + c;
          const R = imgPositionInfo[i * 4 + 0];
          const G = imgPositionInfo[i * 4 + 1];
          const B = imgPositionInfo[i * 4 + 2];
          const A = imgPositionInfo[i * 4 + 3] / 255;
          cacheShadowCssFragments.push(
            `${c + 1}px ${r}px  rgba(${R},${G},${B},${A})`
          );
        }
      }
      return cacheShadowCssFragments.join(",");
    }
  </script>
  <style>
    #app {
      margin-top: 50px;
      width: 1px;
      height: 1px;
      transition: all 1.5s;
    }
  </style>
</html>
```

:::