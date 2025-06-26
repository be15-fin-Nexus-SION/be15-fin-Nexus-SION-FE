<script setup>
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import { getJobParticipationStats } from "@/api/statistics";
import JobList from "@/features/statistics/components/JobList.vue";

const chartRef = ref(null);
const stats = ref([]);
let chartInstance = null;

async function fetchStats() {
  try {
    const response = await getJobParticipationStats();
    stats.value = response.data.data;
  } catch (error) {
    console.error("직무 참여 통계 조회 실패:", error);
  }
}

function renderChart() {
  if (!chartRef.value || stats.value.length === 0) return;

  const sortedStats = [...stats.value].sort((a, b) =>
    a.jobName.localeCompare(b.jobName, ["ko", "en"], { sensitivity: "base" }),
  );

  const labels = sortedStats.map((item) => item.jobName);
  const data = sortedStats.map((item) => item.memberCount);

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(chartRef.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "인원 수",
          data,
          backgroundColor: "#6574F6",
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
          ticks: { stepSize: 5 },
        },
      },
    },
  });
}

onMounted(() => {
  fetchStats();
});

watch(stats, () => {
  renderChart();
});
</script>

<template>
  <div class="page-layout">
    <SidebarWrapper viewType="statistics" />

    <div class="content-wrapper">
      <h1 class="page-title">직무별 등록된 인원 수</h1>
      <p class="page-description">
        프로젝트 기준으로 참여 직무(예: 프론트엔드, 백엔드 등)별 인원 수를
        확인합니다.
      </p>

      <div class="chart-card">
        <canvas ref="chartRef" class="chart-canvas" />
      </div>

      <JobList :stats="stats" />
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
