<template>
  <div class="rich-card" :style="{ background: background, color: color }">
    <div class="rich-card-header" v-if="title || icon">
      <i v-if="icon" :class="iconClasses"></i>
      <h3 v-if="title" class="rich-card-title">{{ title }}</h3>
    </div>
    <div class="rich-card-content">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="rich-card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title?: string;
  icon?: string;
  background?: string;
  color?: string;
  hoverEffect?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  icon: "",
  background: "var(--card-bg, #ffffff)",
  color: "var(--card-color, inherit)",
  hoverEffect: true
});

const iconClasses = computed(() => {
  const classes = [];
  if (props.icon) {
    classes.push(props.icon);
  }
  if (props.icon?.startsWith('fas:') || props.icon?.startsWith('fab:') || props.icon?.startsWith('far:')) {
    // Font Awesome icons from vuepress-theme-hope
    const [prefix, iconName] = props.icon.split(':');
    classes.push(`${prefix} fa-${iconName}`);
  }
  return classes;
});
</script>

<style scoped>
.rich-card {
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: var(--card-bg, #ffffff);
  color: var(--card-color, inherit);
  position: relative;
  overflow: hidden;
}

.rich-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--theme-color, #3eaf7c), var(--theme-color-light, #4abf8a));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.rich-card:hover::before {
  transform: scaleX(1);
}

.rich-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.rich-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.75rem;
}

.rich-card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
}

.rich-card-header i {
  font-size: 1.5rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: var(--theme-color-fade, rgba(62, 175, 124, 0.1));
  color: var(--theme-color, #3eaf7c);
}

.rich-card-content {
  line-height: 1.7;
  font-size: 0.95rem;
  color: var(--card-content-color, #555);
}

.rich-card:hover .rich-card-content {
  color: var(--card-content-hover-color, #333);
}

.rich-card-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

[data-theme="dark"] .rich-card {
  background: var(--card-bg-dark, #2d2d30);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

[data-theme="dark"] .rich-card-content {
  color: var(--card-content-color-dark, #ccc);
}

[data-theme="dark"] .rich-card:hover .rich-card-content {
  color: var(--card-content-hover-color-dark, #eee);
}
</style>