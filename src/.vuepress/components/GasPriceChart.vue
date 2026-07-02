<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import rawData from './lishiyoujia.json'

// 解析数据：提取日期和数值价格
const parseData = () => {
  return rawData.map(item => ({
    date: item.日期,
    price: parseFloat(item.价格.replace(' 元/升', ''))
  })).reverse() // 按时间升序（旧→新）
}

const chartData = parseData()
const chartRef = ref<HTMLDivElement>()
const wrapperRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null
const isFullscreen = ref(false)

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  // 全屏时禁止/恢复页面滚动
  document.body.style.overflow = isFullscreen.value ? 'hidden' : ''
  setTimeout(() => {
    if (chartInstance) {
      chartInstance.resize()
    }
  }, 100)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isFullscreen.value) {
    isFullscreen.value = false
    document.body.style.overflow = ''
    setTimeout(() => chartInstance?.resize(), 100)
  }
}

const initChart = () => {
  if (!chartRef.value) return

  const isDark = document.documentElement.classList.contains('dark')

  chartInstance = echarts.init(chartRef.value)

  // 计算涨跌颜色标记
  const colors = chartData.map((item, idx) => {
    if (idx === 0) return '#999'
    const prev = chartData[idx - 1].price
    if (item.price > prev) return '#ef4444'   // 涨价 - 红色
    if (item.price < prev) return '#22c55e'   // 降价 - 绿色
    return '#999'                               // 持平 - 灰色
  })

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderColor: isDark ? '#334155' : '#e2e8f0',
      textStyle: {
        color: isDark ? '#e2e8f0' : '#1e293b'
      },
      formatter: (params: any) => {
        const item = params[0]
        if (!item) return ''
        const dataIndex = item.dataIndex
        const d = chartData[dataIndex]
        // 计算涨跌
        let changeText = ''
        if (dataIndex > 0) {
          const prev = chartData[dataIndex - 1].price
          const diff = d.price - prev
          changeText = diff > 0
            ? `<span style="color:#ef4444">↑ +${diff.toFixed(2)} 元/升</span>`
            : diff < 0
              ? `<span style="color:#22c55e">↓ ${diff.toFixed(2)} 元/升</span>`
              : `<span style="color:#999">→ 0 元/升</span>`
        }
        return `<strong>${d.date}</strong><br/>
                价格：<strong>${d.price.toFixed(2)} 元/升</strong><br/>
                较上期：${changeText}`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.map(d => d.date),
      axisLabel: {
        rotate: 45,
        fontSize: 10,
        interval: 4, // 每5个显示一个标签避免拥挤
        color: isDark ? '#94a3b8' : '#64748b'
      },
      axisLine: {
        lineStyle: { color: isDark ? '#334155' : '#cbd5e1' }
      },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      name: '元/升',
      nameTextStyle: {
        color: isDark ? '#94a3b8' : '#64748b'
      },
      axisLabel: {
        formatter: '{value}',
        color: isDark ? '#94a3b8' : '#64748b'
      },
      splitLine: {
        lineStyle: {
          color: isDark ? '#1e293b' : '#f1f5f9',
          type: 'dashed'
        }
      }
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        type: 'slider',
        start: 0,
        end: 100,
        height: 30,
        bottom: 0,
        borderColor: isDark ? '#334155' : '#e2e8f0',
        backgroundColor: isDark ? '#0f172a' : '#f8fafc',
        dataBackground: {
          lineStyle: { color: isDark ? '#475569' : '#94a3b8' },
          areaStyle: { color: isDark ? '#1e293b' : '#e2e8f0' }
        },
        selectedDataBackground: {
          lineStyle: { color: '#3b82f6' },
          areaStyle: { color: isDark ? '#1e3a5f' : '#bfdbfe' }
        },
        handleStyle: {
          borderColor: '#3b82f6',
          color: '#3b82f6'
        },
        labelStyle: {
          color: isDark ? '#e2e8f0' : '#1e293b'
        }
      }
    ],
    series: [
      {
        type: 'line',
        data: chartData.map((d, idx) => ({
          value: d.price,
          itemStyle: {
            color: colors[idx]
          }
        })),
        smooth: true,
        lineStyle: {
          width: 2,
          color: '#3b82f6'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.15)' },
            { offset: 1, color: isDark ? 'rgba(59, 130, 246, 0.02)' : 'rgba(59, 130, 246, 0.02)' }
          ])
        },
        symbol: 'circle',
        symbolSize: 4,
        markLine: {
          silent: true,
          data: [
            {
              type: 'average',
              name: '均价',
              label: {
                formatter: '均价: {c} 元/升',
                color: isDark ? '#fbbf24' : '#d97706'
              },
              lineStyle: {
                color: isDark ? '#fbbf24' : '#d97706',
                type: 'dashed'
              }
            }
          ]
        },
        markPoint: {
          data: [
            {
              type: 'max',
              name: '最高价',
              symbolSize: 50,
              label: {
                formatter: '最高\n{c}',
                color: '#ef4444',
                fontWeight: 'bold'
              },
              itemStyle: { color: '#ef4444' }
            },
            {
              type: 'min',
              name: '最低价',
              symbolSize: 50,
              label: {
                formatter: '最低\n{c}',
                color: '#22c55e',
                fontWeight: 'bold'
              },
              itemStyle: { color: '#22c55e' }
            }
          ]
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

// 监听暗色模式切换
const observer = new MutationObserver(() => {
  if (chartInstance) {
    chartInstance.dispose()
    initChart()
  }
})

onMounted(() => {
  initChart()
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
  // 窗口大小自适应
  window.addEventListener('resize', handleResize)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  observer.disconnect()
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('keydown', handleKeydown)
  chartInstance?.dispose()
})

const handleResize = () => {
  chartInstance?.resize()
}
</script>

<template>
  <div ref="wrapperRef" class="gas-price-chart" :class="{ 'is-fullscreen': isFullscreen }">
    <div class="chart-header">
      <div class="chart-header-left">
        <h3>⛽ 安徽 95# 汽油历史价格走势</h3>
        <span class="chart-subtitle">
          {{ chartData[0]?.date }} — {{ chartData[chartData.length - 1]?.date }}
          <span class="count">（共 {{ chartData.length }} 期）</span>
        </span>
      </div>
      <button class="fullscreen-btn" @click="toggleFullscreen" :title="isFullscreen ? '退出全屏 (ESC)' : '全屏查看'">
        <svg v-if="!isFullscreen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
          <polyline points="15 3 21 3 21 9"></polyline>
          <polyline points="9 21 3 21 3 15"></polyline>
          <line x1="21" y1="3" x2="14" y2="10"></line>
          <line x1="3" y1="21" x2="10" y2="14"></line>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
          <polyline points="4 14 10 14 10 20"></polyline>
          <polyline points="20 10 14 10 14 4"></polyline>
          <line x1="14" y1="10" x2="21" y2="3"></line>
          <line x1="10" y1="14" x2="3" y2="21"></line>
        </svg>
      </button>
    </div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<style scoped>
.gas-price-chart {
  margin: 16px 0;
  padding: 16px;
  background: var(--vp-c-bg-soft, #f8fafc);
  border-radius: 12px;
  border: 1px solid var(--vp-c-border, #e2e8f0);
  position: relative;
  transition: all 0.3s ease;
}

.gas-price-chart.is-fullscreen {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 24px;
  border-radius: 0;
  border: none;
  background: var(--vp-c-bg, #fff);
}

.chart-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-border, #e2e8f0);
}

.chart-header-left h3 {
  margin: 0 0 4px;
  font-size: 1.1rem;
  color: var(--vp-c-text, #1e293b);
}

.chart-subtitle {
  font-size: 0.8rem;
  color: var(--vp-c-text-muted, #94a3b8);
}

.count {
  opacity: 0.7;
}

.fullscreen-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--vp-c-border, #e2e8f0);
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-muted, #64748b);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 2px;
}

.fullscreen-btn:hover {
  background: var(--vp-c-bg-mute, #f1f5f9);
  color: var(--vp-c-text, #1e293b);
  border-color: var(--vp-c-text-muted, #94a3b8);
}

.chart-container {
  width: 100%;
  height: 600px;
}

.is-fullscreen .chart-container {
  height: calc(100vh - 100px);
}

/* 暗色模式适配 */
:root.dark .gas-price-chart {
  background: var(--vp-c-bg-soft, #0f172a);
  border-color: var(--vp-c-border, #1e293b);
}

:root.dark .gas-price-chart.is-fullscreen {
  background: var(--vp-c-bg, #0f172a);
}
</style>
