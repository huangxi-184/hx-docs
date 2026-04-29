# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal documentation/learning notes site built with VuePress 2.0 (beta), using the vuepress-theme-hope theme. It hosts various technical notes covering frontend, backend, DevOps, and algorithms.

## Commands

```bash
# Install dependencies
pnpm install

# Start dev server (hot reload enabled when hotReload: true in config)
pnpm dev

# Clean cache and start dev
pnpm clean-dev

# Build for production
pnpm build
```

## Architecture

- **Framework**: VuePress 2.0.0-beta.66 with vuepress-theme-hope 2.0.0-beta.235
- **Source**: `src/` directory contains all content
- **Config**: `src/.vuepress/config.ts` - main VuePress config using hopeTheme
- **Theme entry**: `src/.vuepress/theme.ts` - registers plugins and custom components
- **Custom components**: `src/.vuepress/components/` - Vue components used in markdown (ShelfLifeCalculator, BilibiliAutumn1BannerComponent, DataPanel, NcmToMp3, RichCard, RichCardGrid)
- **Navigation**: `src/.vuepress/navbar/zh.ts` - top navigation structure
- **Sidebar**: `src/.vuepress/sidebar/zh.ts` - sidebar navigation

### Content Structure

- `/web/` - Frontend (axiom, css, JavaScript, project, 小程序, TypeScript, vue, React, 面经, Android)
- `/serve/` - Backend (database, Python, 后端基础)
- `/Linux/` - DevOps (nginx, pm2, docker)
- `/algorithm/` - Algorithms
- `/others/` - Tools and utilities (保质期计算器, NcmToMp3, 大屏展示)
- `/demo/encrypt.html` - Password protected page (password: 1842196429)

### Key Features Enabled

- Full-text search via vuepress-plugin-search-pro
- Dark mode toggle
- Markdown enhancements: charts (echarts), mermaid, katex math, code tabs, GFM, presentations
- Page encryption for specific routes
- Print support