---
title: tinymce的使用
shortTitle: tinymce
icon: fab fa-markdown
order: 4
date: 2023-10-23
category:
  - tinymce-vue
tag:
  - tinymce
---

# tinymce 的使用

## tinymce-vue 的使用

1. 安装 tinymce @tinymce/tinymce-vue 这两个包 `pnpm i tinymce @tinymce/tinymce-vue -S` ** 不同的版本插件不一样,要根据文
   档更新一下 `"tinymce": "5.10.2"` `"@tinymce/tinymce-vue": "^4.0.5"` **

   > 中文文档地址:`http://tinymce.ax-z.cn/`

2. 前往此地址下载中文汉化包： `https://www.tiny.cloud/get-tiny/language-packages/`

3. 引入皮肤和汉化包

```
在项目public文件夹下新建tinymce文件夹，
将下载的汉化包解压到此文件夹
然后在node_modules/tinymce中找到skins文件夹，也复制到public/tinymce里
```

4.封装组件:在 src/components 下新建 TEditor.vue，并写入以下代码

```ts
<template>
  <div class="tinymce-box">
    <Editor
      id="myedit"
      v-model="content"
      :init="init"
      tag-name="div"
      :disabled="disabled"
      @onClick="onClick"
    />
  </div>
</template>

<script setup lang="ts">
  import Editor from '@tinymce/tinymce-vue';
  import tinymce from 'tinymce/tinymce';
  import 'tinymce/themes/silver';
  import 'tinymce/icons/default';

  // 引入编辑器插件
  import 'tinymce/plugins/advlist'; //高级列表
  import 'tinymce/plugins/anchor'; //锚点
  import 'tinymce/plugins/autolink'; //自动链接
  import 'tinymce/plugins/autoresize'; //编辑器高度自适应,注：plugins里引入此插件时，Init里设置的height将失效
  import 'tinymce/plugins/autosave'; //自动存稿
  import 'tinymce/plugins/charmap'; //特殊字符
  import 'tinymce/plugins/code'; //编辑源码
  import 'tinymce/plugins/codesample'; //代码示例
  import 'tinymce/plugins/directionality'; //文字方向
  import 'tinymce/plugins/emoticons'; //表情
  import 'tinymce/plugins/fullpage'; //文档属性
  import 'tinymce/plugins/fullscreen'; //全屏
  import 'tinymce/plugins/help'; //帮助
  import 'tinymce/plugins/hr'; //水平分割线
  import 'tinymce/plugins/image'; //插入编辑图片
  import 'tinymce/plugins/importcss'; //引入css
  import 'tinymce/plugins/insertdatetime'; //插入日期时间
  import 'tinymce/plugins/link'; //超链接
  import 'tinymce/plugins/lists'; //列表插件
  import 'tinymce/plugins/media'; //插入编辑媒体
  import 'tinymce/plugins/nonbreaking'; //插入不间断空格
  import 'tinymce/plugins/pagebreak'; //插入分页符
  import 'tinymce/plugins/paste'; //粘贴插件
  import 'tinymce/plugins/preview'; //预览
  import 'tinymce/plugins/print'; //打印
  import 'tinymce/plugins/quickbars'; //快速工具栏
  import 'tinymce/plugins/save'; //保存
  import 'tinymce/plugins/searchreplace'; //查找替换
  import 'tinymce/plugins/tabfocus'; //切入切出，按tab键切出编辑器，切入页面其他输入框中
  import 'tinymce/plugins/table'; //表格
  import 'tinymce/plugins/template'; //内容模板
  import 'tinymce/plugins/textcolor'; //文字颜色
  import 'tinymce/plugins/textpattern'; //快速排版
  import 'tinymce/plugins/toc'; //目录生成器
  import 'tinymce/plugins/visualblocks'; //显示元素范围
  import 'tinymce/plugins/visualchars'; //显示不可见字符
  import 'tinymce/plugins/wordcount'; //字数统计
  import { ref, watch, onMounted } from 'vue';
  const content = ref(props.modelValue);
  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    plugins: {
      type: [String, Array],
      default: `print preview searchreplace autolink directionality visualblocks
        visualchars fullscreen image link media template code codesample table charmap
        hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave`,
    },
    toolbar: {
      type: [String, Array],
      default:
        'fullscreen undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
                          styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
                          table image media charmap emoticons hr pagebreak insertdatetime print preview | code selectall | indent2em lineheight formatpainter axupimgs',
    },
    height: {
      type: Number,
      default: 800,
    },
  });

  const emit = defineEmits(['update:modelValue', 'onClick']);

  const init = {
    language_url: '/tinymce/langs/zh-Hans.js', //引入语言包文件
    language: 'zh-Hans', //语言类型
    skin_url: '/tinymce/skins/ui/oxide', //皮肤：浅色
    plugins: props.plugins, //插件配置
    toolbar: props.toolbar, //工具栏配置，设为false则隐藏
    toolbar_mode: 'sliding',
    menubar: 'file edit insert view format table tools', //菜单栏配置，设为false则隐藏，不配置则默认显示全部菜单，也可自定义配置--查看 http://tinymce.ax-z.cn/configure/editor-appearance.php --搜索“自定义菜单”
    menu: {
      file: { title: '文件', items: 'newdocument' },
      edit: { title: '编辑', items: 'undo redo | cut copy paste pastetext | selectall' },
      insert: { title: '插入', items: 'link image  |  hr' },
      view: { title: '查看', items: 'visualaid' },
      format: {
        title: '格式',
        items: 'bold italic underline strikethrough superscript subscript | formats | removeformat',
      },
      table: { title: '表格', items: 'inserttable tableprops deletetable | cell row column' },
      tools: { title: '工具', items: 'spellchecker code' },
    },
    fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px', //字体大小
    font_formats:
      '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
    height: props.height, //注：引入autoresize插件时，此属性失效
    placeholder: '在这里输入文字',
    branding: false, //tiny技术支持信息是否显示
    resize: false, //编辑器宽高是否可变，false-否,true-高可变，'both'-宽高均可，注意引号
    statusbar: true, //最下方的元素路径和字数统计那一栏是否显示
    elementpath: false, //元素路径是否显示

    content_style: 'img {max-width:100%;}', //直接自定义可编辑区域的css样式
    images_upload_handler: (blobInfo, success, failure) => {
      const img = 'data:image/jpeg;base64,' + blobInfo.base64();
      success(img);
    },
    readonly : true
  };

  const revertData = (content: string) => {
    emit('update:modelValue', content);
  };

  const onClick = (e: Event) => {
    emit('onClick', e, tinymce);
  };

  const clear = () => {
    content.value = '';
  };

  const setEditMode = (type: string) => {
    tinymce.editors['myedit'].setMode(type);
  };
  watch(
    () => props.modelValue,
    (newVal) => {
      content.value = newVal;
    }
  );

  watch(content, (newVal) => {
    revertData(newVal);
  });
</script>

```

5. 在组件中使用

```ts
<template>
  <!-- <router-view></router-view>
   -->
  <TEditor ref="editor" v-model="content" />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import TEditor from '@/components/TEditor/TEditor.vue';

  const content = ref('');
</script>
```
