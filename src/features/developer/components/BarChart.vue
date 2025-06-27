<template>
  <div class="w-full h-72">
    <Bar ref="barChartRef" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { ref, computed, watch, nextTick } from 'vue'

// Chart.js 등록
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const barChartRef = ref(null)
const gradientBackground = ref(null)

const chartData = computed(() => {
  if (!props.data || !Array.isArray(props.data)) {
    return { labels: [], datasets: [] }
  }

  const labels = props.data.map(item => item.techStackName)
  const values = props.data.map(item => item.score * 10)

  return {
    labels,
    datasets: [
      {
        label: '기술 스택 점수',
        data: values,
        backgroundColor: gradientBackground.value || 'rgba(99, 102, 241, 0.6)', // fallback
        borderRadius: 4,
        categoryPercentage: 0.8,
        barPercentage: 0.9
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: ${context.raw}점`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 10,
        callback: (val) => `${val}`
      }
    }
  }
}

// 🧠 그라데이션 생성 및 주입
watch(
    () => props.data,
    async () => {
      await nextTick()
      const chart = barChartRef.value?.chart
      if (!chart) return

      const ctx = chart.ctx
      const gradient = ctx.createLinearGradient(0, 0, 0, chart.height)
      gradient.addColorStop(0, 'rgba(254, 134, 134, 1)') // 빨강
      gradient.addColorStop(1, 'rgba(30, 38, 141, 1)')   // 남색

      gradientBackground.value = gradient
      chart.update()
    },
    { immediate: true }
)
</script>