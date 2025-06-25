<script setup>
import { ref, watch } from "vue";
import { getPopularTechStacks } from "@/api/statistics";
import Chart from "chart.js/auto";
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import PopularList from "@/features/statistics/components/PopularList.vue";

const chartRef = ref(null);
let chartInstance = null;

const period = ref("1m");
const top = ref(5);

const contentList = ref([]);

watch([period, top], renderInitialChartData, { immediate: true });

function formatDateKey(dateStr) {
  const [, month, day] = dateStr.split("-");
  return `${Number(month)}/${day}`;
}

function formatMonthKey(monthStr) {
  const [year, month] = monthStr.split("-");
  return `${year}년 ${Number(month)}월`;
}

function resetFilters() {
  period.value = "1m";
  top.value = 5;
}

async function renderInitialChartData() {
  try {
    const res = await getPopularTechStacks(period.value, top.value);
    const content = res.data.data.content;

    contentList.value = content;

    const isDaily = period.value === "1m";
    const allKeysSet = new Set();

    content.forEach((item) => {
      const usageMap = item.monthlyUsage || {};
      Object.keys(usageMap).forEach((key) => allKeysSet.add(key));
    });

    const sortedKeys = [...allKeysSet].sort();
    const xLabels = isDaily
      ? sortedKeys.map(formatDateKey)
      : sortedKeys.map(formatMonthKey);

    const colorPalette = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#6366f1",
      "#ec4899",
      "#06b6d4",
      "#8b5cf6",
      "#f97316",
      "#22c55e",
      "#a855f7",
      "#e11d48",
      "#0ea5e9",
      "#84cc16",
      "#f43f5e",
      "#14b8a6",
      "#7c3aed",
      "#eab308",
      "#4ade80",
      "#c084fc",
    ];

    const datasets = content.map((item, idx) => {
      const usage = item.monthlyUsage || {};

      let cumulative = 0;
      const data = sortedKeys.map((k) => {
        cumulative += usage[k] || 0;
        return cumulative;
      });

      return {
        label: item.techStackName,
        data,
        borderColor: colorPalette[idx % colorPalette.length],
        backgroundColor: colorPalette[idx % colorPalette.length] + "33",
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6,
      };
    });

    renderMultiLineChart(xLabels, datasets);
  } catch (e) {
    console.error("차트 데이터 조회 실패:", e);
    contentList.value = [];
    renderMultiLineChart([], []);
  }
}

function renderMultiLineChart(labels, datasets) {
  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = chartRef.value.getContext("2d");
  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "누적 사용 횟수",
          },
          ticks: {
            stepSize: 1,
            precision: 0,
          },
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 30,
            autoSkip: true,
            maxTicksLimit: 12,
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
      <h1 class="page-title">기간별 인기 기술 스택</h1>
      <p class="page-description">
        기간별 프로젝트에 가장 많이 사용된 기술 스택을 조회합니다. 시간 단위를
        선택하면 Top n 기술 스택이 시각화됩니다.
      </p>
      <div class="filter-solid">
        <div class="filter-bar">
          <select id="time-select" class="filter-dropdown" v-model="period">
            <option disabled value="">기간 선택</option>
            <option value="1m">최근 1달</option>
            <option value="6m">최근 6달</option>
            <option value="1y">최근 1년</option>
            <option value="5y">최근 5년</option>
          </select>

          <select id="top-select" class="filter-dropdown" v-model="top">
            <option disabled value="">Top n</option>
            <option :value="5">Top 5</option>
            <option :value="10">Top 10</option>
            <option :value="20">Top 20</option>
          </select>
        </div>

        <PrimaryButton
          label="필터 초기화"
          bg-color-class="bg-natural-gray"
          hover-color-class="hover:bg-natural-gray-hover"
          text-color-class="text-black"
          :onClick="resetFilters"
        />
      </div>

      <div class="chart-card">
        <canvas ref="chartRef" class="chart-canvas" />
      </div>

      <PopularList :list="contentList" />
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
  @apply flex justify-start gap-2;
}

.filter-dropdown {
  @apply appearance-none bg-[#f5f5f5] rounded-md px-[20px] py-[11px] text-bodySm text-black shadow-sm;
  background-image: url("data:image/svg+xml,%3Csvg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.5rem;
  padding-right: 2.5rem;
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
