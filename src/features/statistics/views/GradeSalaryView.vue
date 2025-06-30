<script setup>
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import { getSalaryByGrade } from "@/api/statistics";
import SalaryList from "@/features/statistics/components/SalaryList.vue";
import SortDropdown from "@/components/SortDropdown.vue";

const chartRef = ref(null);
const stats = ref([]);
const salaryType = ref("avg");
let chartInstance = null;

const GRADE_ORDER = ["S", "A", "B", "C", "D"];

const salaryOptions = [
  { name: "평균 연봉", value: "avg" },
  { name: "최소 연봉", value: "min" },
  { name: "최대 연봉", value: "max" },
];

function onSalaryChange(option) {
  salaryType.value = option.value;
}

async function fetchStats() {
  try {
    const response = await getSalaryByGrade();
    stats.value = response.data.data;
  } catch (error) {
    console.error("등급별 연봉 조회 실패:", error);
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

  const sortedStats = [...stats.value].sort(
    (a, b) =>
      GRADE_ORDER.indexOf(a.gradeCode) - GRADE_ORDER.indexOf(b.gradeCode),
  );

  const labels = sortedStats.map((item) => item.gradeCode);
  const data = sortedStats.map((item) => {
    if (salaryType.value === "min") return item.minSalary;
    if (salaryType.value === "max") return item.maxSalary;
    return item.avgSalary;
  });

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
watch([stats, salaryType], renderChart);
</script>

<template>
  <div class="page-layout">
    <SidebarWrapper viewType="statistics" />

    <div class="content-wrapper">
      <h1 class="page-title">등급별 연봉 분포</h1>
      <p class="page-description">
        등급별로 최소, 최대, 평균 연봉을 확인 할 수 있습니다.
      </p>

      <div class="filter-solid">
        <SortDropdown
          :options="salaryOptions"
          :defaultValue="salaryOptions.find((opt) => opt.value === salaryType)"
          @change="onSalaryChange"
        />
      </div>

      <div class="chart-card">
        <canvas ref="chartRef" class="chart-canvas" />
      </div>

      <SalaryList :stats="stats" :salaryType="salaryType" />
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
