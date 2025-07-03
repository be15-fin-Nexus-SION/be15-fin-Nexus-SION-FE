<script setup>
import { ref, watch, onMounted } from "vue";
import { getTechAdoptionTrendByYear, getProjectYears } from "@/api/statistics";
import Chart from "chart.js/auto";
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import SortDropdown from "@/components/dropdown/SortDropdown.vue";
import TechList from "@/features/statistics/components/TechList.vue";
import { showErrorToast } from "@/utills/toast.js";

const chartRef = ref(null);
let chartInstance = null;

const year = ref(null);
const yearOptions = ref([]);
const contentList = ref([]);

onMounted(async () => {
  try {
    const res = await getProjectYears();
    const years = res.data.data;
    yearOptions.value = years.map((y) => ({ name: `${y}년`, value: y }));
    if (years.length > 0) {
      year.value = years[0];
      await fetchTrendData();
    }
  } catch (e) {
    const errorMessage = e.response?.data?.message || "연도 목록 로딩 실패";
    showErrorToast(errorMessage);
  }
});

watch(year, async (newVal) => {
  if (typeof newVal === "number" && !Number.isNaN(newVal)) {
    await fetchTrendData();
  }
});

function onYearChange(option) {
  year.value = option.value;
}

async function fetchTrendData() {
  if (!year.value) return;
  try {
    const res = await getTechAdoptionTrendByYear(year.value); // 변경됨
    const data = res.data.data; // 변경됨
    contentList.value = data;

    const groupedByStack = {};
    data.forEach((item) => {
      const key = `${item.quarter}`;
      if (!groupedByStack[item.techStackName]) {
        groupedByStack[item.techStackName] = {};
      }
      groupedByStack[item.techStackName][key] = item.percentage;
    });

    const quarterLabels = ["1분기", "2분기", "3분기", "4분기"];
    const quarterKeys = ["1", "2", "3", "4"];

    const colorPalette = [
      "#404591",
      "#A07298",
      "#BFA0C9",
      "#FE8686",
      "#F59E9E",
      "#B16B6B",
      "#814477",
      "#BF7384",
      "#1E268D",
      "#6D62B5",
      "#9E84AD",
    ];

    const datasets = Object.keys(groupedByStack).map((stackName, idx) => {
      const dataPoints = quarterKeys.map(
        (q) => groupedByStack[stackName][q] || 0,
      );
      return {
        label: stackName,
        data: dataPoints,
        borderColor: colorPalette[idx % colorPalette.length],
        backgroundColor: colorPalette[idx % colorPalette.length] + "33",
        fill: false,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      };
    });

    renderLineChart(quarterLabels, datasets);
  } catch (e) {
    const errorMessage = e.response?.data?.message || "도입률 데이터 조회 실패";
    showErrorToast(errorMessage);
    contentList.value = [];
    renderLineChart([], []);
  }
}

function renderLineChart(labels, datasets) {
  if (chartInstance) chartInstance.destroy();
  const ctx = chartRef.value.getContext("2d");
  chartInstance = new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "도입률 (%)" },
          ticks: { stepSize: 10, precision: 0 },
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 30,
            autoSkip: false,
          },
        },
      },
    },
  });
}
</script>

<template>
  <div class="page-layout">
    <SidebarWrapper viewType="statistics" />

    <div class="content-wrapper">
      <h1 class="page-title">기술 스택 도입률 변화 추이</h1>
      <p class="page-description">
        연도-분기별로 기술 스택의 프로젝트 도입률을 확인할 수 있습니다.
      </p>

      <div class="filter-solid">
        <div class="filter-bar">
          <SortDropdown
            v-if="year && yearOptions.length"
            :options="yearOptions"
            :defaultValue="yearOptions.find((opt) => opt.value === year)"
            @change="onYearChange"
          />
        </div>
      </div>

      <div class="chart-card">
        <canvas ref="chartRef" class="chart-canvas" />
      </div>

      <TechList :list="contentList" :year="year" />
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

.filter-solid {
  @apply flex justify-between;
}

.filter-bar {
  @apply flex justify-start gap-4 items-center;
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
