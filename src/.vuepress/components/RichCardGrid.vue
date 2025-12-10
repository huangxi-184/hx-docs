<template>
  <div class="rich-card-grid" :class="{ 'grid-cols-1': cols === 1, 'grid-cols-2': cols === 2, 'grid-cols-3': cols === 3, 'grid-cols-4': cols === 4 }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  cols?: number; // 默认列数
  gap?: string;  // 间距
  responsive?: boolean; // 是否响应式
}

withDefaults(defineProps<Props>(), {
  cols: 0, // 0表示自动列数
  gap: '1.5rem',
  responsive: true
});
</script>

<style scoped>
.rich-card-grid {
  display: grid;
  gap: v-bind(gap);
  margin: 1.5rem 0;
}

/* 自动列数 - 响应式网格 */
.rich-card-grid:not(.grid-cols-1):not(.grid-cols-2):not(.grid-cols-3):not(.grid-cols-4) {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

/* 固定列数 */
.grid-cols-1 {
  grid-template-columns: 1fr;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .rich-card-grid:not(.grid-cols-1) {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
  
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .rich-card-grid:not(.grid-cols-1) {
    grid-template-columns: 1fr;
  }
  
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }
  
  .rich-card-grid {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .rich-card-grid {
    gap: 0.75rem;
    margin: 1rem 0;
  }
}
</style>