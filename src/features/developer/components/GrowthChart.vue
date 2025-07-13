<script setup>
import { ref, onMounted, nextTick } from "vue";
import { Chart, registerables } from "chart.js";
import { fetchScoreTrend } from "@/api/member";

Chart.register(...registerables);

// ✅ JavaScript에서 구조 분해 방식으로 props 안전하게 꺼내기
const { employeeId } = defineProps(["employeeId"]);

const canvasRef = ref(null);

async function drawChart() {
  try {
    const labels = getRecentTenMonths();

    if (!employeeId) {
      console.warn("⚠️ employeeId가 없습니다.");
      return;
    }

    const res = await fetchScoreTrend(employeeId);
    const trendData = res.data.data;

    console.log("📊 받아온 성장 점수 데이터:", trendData);

    await nextTick(); // DOM 준비

    const ctx = canvasRef.value?.getContext("2d");
    if (!ctx) {
      console.error("❌ canvasRef가 아직 null 상태입니다.");
      return;
    }

    new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "기술 성장 점수",
            data: labels.map((label) => {
              const item = trendData.find((d) => d.month === label);
              return item ? item.score : 0;
            }),
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
        },
        scales: {
          y: {
            beginAtZero: true,
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
  <div class="w-full h-72">
    <canvas ref="canvasRef" class="w-full h-full block"></canvas>
  </div>
</template>
