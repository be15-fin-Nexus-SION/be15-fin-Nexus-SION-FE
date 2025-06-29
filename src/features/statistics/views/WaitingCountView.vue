<script setup>
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import { getWaitingCountByGrade } from "@/api/statistics";
import WaitingCountList from "@/features/statistics/components/WaitingCountList.vue";

const chartRef = ref(null);
const stats = ref([]);
let chartInstance = null;

// 등급 정렬 우선순위 (S > A > B > C > D)
const GRADE_ORDER = ["S", "A", "B", "C", "D"];

async function fetchStats() {
  try {
    const response = await getWaitingCountByGrade();
    stats.value = response.data.data;
  } catch (error) {
    console.error("등급별 대기 인원 통계 조회 실패:", error);
  }
}

function renderChart() {
  if (!chartRef.value || stats.value.length === 0) return;

  const ctx = chartRef.value.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 230);
  gradient.addColorStop(0 / 230, "#404591");
  gradient.addColorStop(100 / 230, "#705C95");
  gradient.addColorStop(150 / 230, "#A07298");
  gradient.addColorStop(230 / 230, "#FFC0C0");

  // ✅ GRADE_ORDER 기준으로 수동 정렬
  const sortedStats = [...stats.value].sort(
    (a, b) =>
      GRADE_ORDER.indexOf(a.gradeCode) - GRADE_ORDER.indexOf(b.gradeCode),
  );

  const labels = sortedStats.map((item) => item.gradeCode);
  const data = sortedStats.map((item) => item.waitingCount);

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(chartRef.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: gradient,
          borderRadius: 25,
          borderSkipped: "bottom",
          categoryPercentage: 0.8,
          barPercentage: 0.7,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, precision: 0 },
        },
      },
    },
  });
}

onMounted(fetchStats);
watch(stats, renderChart);
</script>

<template>
  <div class="page-layout">
    <SidebarWrapper viewType="statistics" />

    <div class="content-wrapper">
      <h1 class="page-title">등급별 대기 상태 인원수</h1>
      <p class="page-description">
        등급별로 현재 '대기중' 상태인 인원수를 조회할 수 있습니다.
      </p>

      <div class="chart-card">
        <canvas ref="chartRef" class="chart-canvas" />
      </div>

      <WaitingCountList :stats="stats" />
    </div>
  </div>
</template>

<style scoped>
.page-layout {
  @apply relative flex;
}

.content-wrapper {
  @apply flex-1 px-16 py-12 max-w-[970px];
}

.page-title {
  @apply text-headlineSm text-black font-semibold mb-2;
}

.page-description {
  @apply text-bodyMd text-support-stack_dark mb-6;
}

.chart-card {
  @apply bg-white shadow-base p-6 rounded-lg w-full mt-10;
  overflow-x: hidden;
}

.chart-canvas {
  @apply max-h-[300px];
  display: block;
  width: 100%;
  height: 300px;
}
</style>
