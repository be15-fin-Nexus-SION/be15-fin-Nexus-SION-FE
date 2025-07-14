<script setup>
import { ref, onMounted, nextTick } from "vue";
import { Chart, registerables } from "chart.js";
import { fetchScoreTrend } from "@/api/member";

Chart.register(...registerables);

const { employeeId } = defineProps(["employeeId"]);

const canvasRef = ref(null);
const hasData = ref(true);

async function drawChart() {
  try {
    const labels = getRecentTenMonths();

    if (!employeeId) {
      console.warn("⚠️ employeeId가 없습니다.");
      hasData.value = false;
      return;
    }

    const res = await fetchScoreTrend(employeeId);
    const trendData = res.data.data;

    console.log("📊 받아온 성장 점수 데이터:", trendData);

    if (!trendData || trendData.length === 0) {
      hasData.value = false;
      return;
    }

    hasData.value = true;
    await nextTick();

    const ctx = canvasRef.value?.getContext("2d");
    if (!ctx) {
      console.error("❌ canvasRef가 아직 null 상태입니다.");
      return;
    }

    const labelsWithScores = labels.map((label) => {
      const item = trendData.find((d) => d.month === label);
      return { label, score: item ? item.score : 0 };
    });

    const scores = labelsWithScores.map((item) => item.score);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);

    const adjustedMin = Math.floor(minScore * 0.8);
    const adjustedMax = Math.ceil(maxScore * 1.1);

    new Chart(ctx, {
      type: "line",
      data: {
        labels: labelsWithScores.map((item) => item.label),
        datasets: [
          {
            label: "총점수",
            data: scores,
            borderColor: "#3B82F6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            fill: true,
            tension: 0.3,
            pointRadius: 5,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                const index = context.dataIndex;
                const current = context.dataset.data[index];
                const prev = context.dataset.data[index - 1];

                let diffStr = "";
                if (index > 0 && typeof prev === "number") {
                  const diff = current - prev;
                  const sign = diff > 0 ? "+" : diff < 0 ? "" : "±";
                  diffStr = ` (${sign}${diff})`;
                }

                return `총점수: ${current}${diffStr}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            min: adjustedMin,
            max: adjustedMax,
            title: { display: true, text: "점수" },
          },
          x: {
            title: { display: true, text: "월별" },
          },
        },
      },
    });
  } catch (error) {
    console.error("점수 추이 데이터를 불러오는 중 오류 발생:", error);
    hasData.value = false;
  }
}

function getRecentTenMonths() {
  const labels = [];
  const now = new Date();
  for (let i = 9; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    );
  }
  return labels;
}

onMounted(() => {
  drawChart();
});
</script>

<template>
  <div class="w-full h-72 relative">
    <canvas v-if="hasData" ref="canvasRef" class="w-full h-full block"></canvas>
    <div
      v-else
      class="absolute inset-0 flex items-center justify-center text-gray-400 text-sm"
    >
      표시할 데이터가 없습니다.
    </div>
  </div>
</template>
