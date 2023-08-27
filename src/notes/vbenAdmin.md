---
title: Vben Admin i18n国际化实现
icon: fab fa-markdown
order: 2
category:
  - 使用指南
tag:
  - Vben Admin
---

1. 打开项目,找到src/settings/localeSetting.ts文件,比如我需要添加一个俄语,就在
```
export const LOCALE: { [key: string]: LocaleType } = {
  ZH_CN: 'zh_CN',
  EN_US: 'en',
  RU_RU: 'ru_RU' // 新添加的俄语
};

export const localeSetting: LocaleSetting = {
  showPicker: true,
  // Locale
  locale: LOCALE.ZH_CN,
  // Default locale 默认语言
  fallback: LOCALE.ZH_CN,
  // available Locales 可以选择的语言
  availableLocales: [LOCALE.ZH_CN, LOCALE.EN_US, LOCALE.RU_RU], // 添加上可以选择的俄语选项
};
// locale list 选择语言的下拉列表
export const localeList: DropMenu[] = [
  {
    text: '简体中文',
    event: LOCALE.ZH_CN,
  },
  {
    text: 'English',
    event: LOCALE.EN_US,
  },
  // 此处也添加上需要的语言
  {
    text: 'Pусск',
    event: LOCALE.RU_RU,
  }
];
```
2. 打开types/config.d.ts 文件,找到
```
// 添加你想加入的语言,这里添加ru_RU, 保证ts 类型的正确
export type LocaleType = 'zh_CN' | 'en' | 'ru_RU' ;
```

3.进入src/locales/lang文件夹,添加一个新文件夹ru_RU,内容直接复制一份之前的语言定义的文件,暂时
这是vben 中语言文件夹结构.
```
# 中文语言
zh_CN:
  component: 组件相关
  layout: 布局相关
  routes: 路由菜单相关
  sys: 系统页面相关
```
按照原来的,直接改写后面的翻译字段.

4.在src/locales/lang目录下,新建一个ru_RU.ts文件,导入使用组件的国际化翻译,暴露出相关的信息.
```
import { genMessage } from '../helper';
import antdLocale from 'ant-design-vue/es/locale/ru_RU';
import momentLocale from 'moment/dist/locale/ru';

const modules = import.meta.globEager('./ru_RU/**/*.ts');
export default {
    message: {
        ...genMessage(modules, 'ru_RU'),
        antdLocale,
    },
    momentLocale,
    momentLocaleName: 'ru',
};

```

5. 在语言选择(AppLocalePicker.vue)组件中,添加一个新的节点,并添加事件.切换国际化语言(根据个人项目区别)
```
// 新增俄语选择的节点,点击切换
    <label
      :class="['custom-radio-wrapper', { 'custom-radio-wrapper-active': localeKey === 'ru_RU' }]"
      @click="localeChange('ru_RU')"
    >
      Pусск
    </label>
```

6. 在src/locales/lang目录下,找到你想修改的语言变量,修改好想要添加的语言就行.至此vben国际化基本完成

``` 
// 举例说明
export default {
  organization: 'Организационное управление',
};
```

7. 使用的方式如下所示
```
// 使用官网的方式,不用原生useI18n
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

// 需要展示的字符变量   (components.modal.organization) 表示文件结构, 每个点都是一层目录.按照第六步的格式修改就可以了.
const organization = t('components.modal.organization');
```