<template>
  <div class="w-full h-[430px] flex items-center justify-center">
    <Radar
      v-if="originalLabelCount >= 3"
      ref="radarChartRef"
      :key="chartKey"
      :data="paddedRadarData"
      :options="options"
    />
    <div v-else class="h-40 flex items-start justify-center">
      <p class="text-gray-400 text-sm">
        기술 스택이 3개 이상일 때 레이더 차트를 표시합니다.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed } from "vue";
import { Radar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
);

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const originalLabelCount = computed(() => props.data?.labels?.length ?? 0);

const paddedRadarData = ref({ labels: [], datasets: [] });
const chartKey = ref(0);
const radarChartRef = ref(null);

watch(
  () => props.data,
  async (newVal) => {
    if (!newVal?.datasets?.[0]) {
      paddedRadarData.value = { labels: [], datasets: [] };
      chartKey.value++;
      return;
    }

    const labels = [...newVal.labels];
    const data = [...newVal.datasets[0].data];

    paddedRadarData.value = {
      labels,
      datasets: [
        {
          ...newVal.datasets[0],
          data,
          backgroundColor: "transparent",
          borderWidth: 2,
        },
      ],
    };
    chartKey.value++;

    await nextTick();
    applyGradientBorder();
  },
  { immediate: true, deep: true },
);

function applyGradientBorder() {
  const chartInstance = radarChartRef.value?.chart;
  if (!chartInstance || !chartInstance.ctx || !chartInstance.width) return;

  const ctx = chartInstance.ctx;
  const gradient = ctx.createLinearGradient(0, 0, chartInstance.width, 0);
  gradient.addColorStop(0, "rgba(254, 134, 134, 1)");
  gradient.addColorStop(1, "rgba(30, 38, 141, 1)");

  chartInstance.data.datasets[0].borderColor = gradient;
  chartInstance.update();
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    r: {
      suggestedMin: 0,
      suggestedMax: 5,
      angleLines: { display: true },
      pointLabels: {
        font: { size: 10 },
        padding: 10,
        callback: (label) => {
          return label.length > 10 ? label.slice(0, 10) + "…" : label;
        },
      },
    },
  },
};
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: 100% !important;
}
</style>
