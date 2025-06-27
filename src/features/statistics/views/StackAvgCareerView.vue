<script setup>
import { ref, onMounted, watch, computed } from "vue";
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import TechStackSearchBar from "@/components/searchBar/TechStackSearchBar.vue";
import TechBadge from "@/components/badge/TechBadge.vue";
import { Chart } from "chart.js/auto";
import { getStackAvgCareer } from "@/api/statistics.js";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import AvgList from "@/features/statistics/components/AvgList.vue";

const barCanvas = ref(null);
let chartInstance = null;

const selectedStacksForChart = ref([]);
const selectedStacksForFilter = ref([]);
const sortOption = ref("techStackName");

const sortedChartStacks = computed(() =>
  [...selectedStacksForChart.value].sort((a, b) => a.localeCompare(b)),
);

function renderChart(labels = [], values = []) {
  const ctx = barCanvas.value.getContext("2d");
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: "#6574F6",
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
          title: { display: true, text: "평균 경력" },
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

async function renderInitialChartData() {
  if (selectedStacksForChart.value.length === 0) {
    renderChart([], []);
    return;
  }

  try {
    const res = await getStackAvgCareer({
      stackList: selectedStacksForChart.value,
      page: 0,
      size: 10,
      sort: sortOption.value,
      direction: "asc",
    });
    const data = res.data.data.content;
    const labels = data.map((item) => item.techStackName);
    const values = data.map((item) => item.averageCareer);
    renderChart(labels, values);
  } catch (e) {
    console.error("차트 데이터 조회 실패:", e);
  }
}

function handleStackSelect(stack) {
  if (!selectedStacksForChart.value.includes(stack)) {
    selectedStacksForChart.value.push(stack);
    selectedStacksForFilter.value.push(stack);
    renderInitialChartData();
  }
}

function handleRemoveFromChart(stack) {
  selectedStacksForChart.value = selectedStacksForChart.value.filter(
    (s) => s !== stack,
  );
  selectedStacksForFilter.value = selectedStacksForFilter.value.filter(
    (s) => s !== stack,
  );
  renderInitialChartData();
}

function resetFilters() {
  selectedStacksForChart.value = [];
  selectedStacksForFilter.value = [];
  renderChart([], []);
}

watch(sortOption, () => {
  renderInitialChartData();
});

onMounted(() => {
  renderChart();
  window.addEventListener("resize", () => {
    selectedStacksForChart.value.length > 0
      ? renderInitialChartData()
      : renderChart([], []);
  });
});
</script>

<template>
  <div class="page-layout">
    <SidebarWrapper viewType="statistics" />

    <div class="content-wrapper">
      <h1 class="page-title">기술 스택별 평균 경력 조회</h1>
      <p class="page-description">
        각 기술 스택별로 해당 기술을 보유한 개발자들의 평균 경력을 확인할 수
        있습니다.
      </p>

      <div class="search-section">
        <div class="search-bar">
          <TechStackSearchBar
            placeholder="기술스택 검색"
            :selectedStacks="selectedStacksForChart"
            @select="handleStackSelect"
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
        <canvas ref="barCanvas" class="chart-canvas" />
      </div>

      <AvgList
        :selectedStacks="selectedStacksForChart"
        :sortOption="sortOption"
        @updateSort="(val) => (sortOption.value = val)"
      />
    </div>
  </div>
</template>

<style scoped>
.page-layout {
  @apply flex justify-center;
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
