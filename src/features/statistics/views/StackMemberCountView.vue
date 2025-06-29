<template>
  <div class="page-layout">
    <SidebarWrapper viewType="statistics" />

    <div class="content-wrapper">
      <h1 class="page-title">기술 스택별 구성원 수</h1>
      <p class="page-description">
        기술 스택을 선택하여 해당 스택을 보유한 개발자 수를 확인할 수 있습니다.
      </p>

      <div class="search-section">
        <div class="search-bar">
          <SearchBar
            placeholder="기술 스택 검색"
            :options="allStacks"
            @search="handleStackSearch"
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

      <div class="stack-button-list">
        <TechBadge
          v-for="stack in sortedChartStacks"
          :key="stack"
          :label="stack"
          :showClose="true"
          @remove="handleRemoveFromChart(stack)"
        />
      </div>

      <div class="chart-card">
        <canvas ref="chartRef" class="chart-canvas" />
      </div>

      <DevList
        :selectedStacks="selectedStacksForFilter"
        :allStacks="selectedStacksForChart"
        @remove="handleRemoveFromFilter"
        @add="handleAddToFilter"
        @reset="resetFilterStacks"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from "vue";
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import SearchBar from "@/components/searchBar/TechStackSearchBar.vue";
import TechBadge from "@/components/badge/TechBadge.vue";
import { Chart } from "chart.js/auto";
import { getStackMemberCounts, getAllTechStacks } from "@/api/statistics.js";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import DevList from "@/features/statistics/components/DevList.vue";

const chartRef = ref(null);
let chartInstance = null;

const selectedStacksForChart = ref([]);
const selectedStacksForFilter = ref([]);
const allStacks = ref([]);

const sortedChartStacks = computed(() =>
  [...selectedStacksForChart.value].sort((a, b) => a.localeCompare(b)),
);

function resetFilterStacks() {
  selectedStacksForFilter.value = [];
}

async function renderChart(labels = [], values = []) {
  await nextTick();
  const ctx = chartRef.value?.getContext("2d");
  if (!ctx) return;

  const gradient = ctx.createLinearGradient(0, 0, 0, 230);
  gradient.addColorStop(0, "#404591");
  gradient.addColorStop(0.5, "#A07298");
  gradient.addColorStop(1, "#FFC0C0");

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          data: values,
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
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "보유 수" },
          ticks: { stepSize: 5 },
        },
        x: {
          ticks: { autoSkip: false },
        },
      },
      plugins: {
        legend: { display: false },
      },
    },
  });
}

async function fetchChartData() {
  if (selectedStacksForChart.value.length === 0) {
    renderChart([], []);
    return;
  }

  try {
    const res = await getStackMemberCounts(selectedStacksForChart.value);
    const data = res.data.data;
    const labels = data.map((item) => item.techStackName);
    const values = data.map((item) => item.count);
    renderChart(labels, values);
  } catch (e) {
    console.error("차트 데이터 조회 실패:", e);
  }
}

function handleStackSearch(keyword) {
  const normalized = keyword.trim();
  if (!normalized) return;

  const lowerKeyword = normalized.toLowerCase();
  const alreadySelectedLower = selectedStacksForChart.value.map((s) =>
    s.toLowerCase(),
  );
  if (!alreadySelectedLower.includes(lowerKeyword)) {
    const exactMatch = allStacks.value.find(
      (s) => s.toLowerCase() === lowerKeyword,
    );
    if (exactMatch) {
      selectedStacksForChart.value.push(exactMatch);
      selectedStacksForFilter.value.push(exactMatch);
      fetchChartData();
    }
  }
}

function handleRemoveFromChart(stack) {
  selectedStacksForChart.value = selectedStacksForChart.value.filter(
    (s) => s !== stack,
  );
  selectedStacksForFilter.value = selectedStacksForFilter.value.filter(
    (s) => s !== stack,
  );
  fetchChartData();
}

function handleAddToFilter(stack) {
  if (!selectedStacksForFilter.value.includes(stack)) {
    selectedStacksForFilter.value.push(stack);
  }
}

function handleRemoveFromFilter(stack) {
  selectedStacksForFilter.value = selectedStacksForFilter.value.filter(
    (s) => s !== stack,
  );
}

function resetFilters() {
  selectedStacksForChart.value = [];
  selectedStacksForFilter.value = [];
  renderChart([], []);
}

onMounted(async () => {
  try {
    const res = await getAllTechStacks();
    allStacks.value = res.data.data;
  } catch (e) {
    console.error("기술 스택 목록 조회 실패:", e);
  }

  renderChart();

  window.addEventListener("resize", () => {
    selectedStacksForChart.value.length > 0
      ? fetchChartData()
      : renderChart([], []);
  });
});
</script>

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

.search-section {
  @apply flex justify-between items-center gap-4 mb-4;
}

.search-bar {
  @apply w-[300px];
}

.stack-button-list {
  @apply flex gap-2 mb-6 flex-wrap;
}

.chart-card {
  @apply bg-white shadow-base p-6 rounded-lg w-full;
  overflow-x: hidden;
}

.chart-canvas {
  display: block;
  width: 100%;
  height: 300px;
}
</style>
