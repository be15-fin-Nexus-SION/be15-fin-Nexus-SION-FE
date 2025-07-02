<script setup>
import { ref, watch } from "vue";
import { getPopularTechStacks } from "@/api/statistics";
import Chart from "chart.js/auto";
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import SortDropdown from "@/components/dropdown/SortDropdown.vue";
import PopularList from "@/features/statistics/components/PopularList.vue";

const chartRef = ref(null);
let chartInstance = null;

const period = ref("1m");
const top = ref(5);

const contentList = ref([]);

const periodOptions = [
  { name: "최근 1달", value: "1m" },
  { name: "최근 6달", value: "6m" },
  { name: "최근 1년", value: "1y" },
  { name: "최근 5년", value: "5y" },
];

const topOptions = [
  { name: "Top 5", value: 5 },
  { name: "Top 10", value: 10 },
  { name: "Top 20", value: 20 },
];

watch([period, top], renderInitialChartData, { immediate: true });

function onPeriodChange(option) {
  period.value = option.value;
}

function onTopChange(option) {
  top.value = option.value;
}

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
  if (chartInstance) chartInstance.destroy();

  const ctx = chartRef.value.getContext("2d");
  chartInstance = new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "누적 사용 횟수" },
          ticks: { stepSize: 1, precision: 0 },
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
          <SortDropdown
            :options="periodOptions"
            :defaultValue="periodOptions.find((opt) => opt.value === period)"
            @change="onPeriodChange"
          />
          <SortDropdown
            :options="topOptions"
            :defaultValue="topOptions.find((opt) => opt.value === top)"
            @change="onTopChange"
          />
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
