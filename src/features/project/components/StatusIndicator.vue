<script setup>
const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "sm", // "sm" | "md"
  },
  mode: {
    type: String,
    default: "project", // "project" | "analysis"
  },
});

const statusColorMap = {
  project: {
    INCOMPLETE: "#9e9e9e",
    WAITING: "#FFD344",
    IN_PROGRESS: "#64CF8B",
    EVALUATION: "#6574F6",
    COMPLETE: "#EC4D4D",
  },
  analysis: {
    PENDING: { label: "분석대기", color: "#808080" },
    PROCEEDING: { label: "분석중", color: "#00C18D" },
    COMPLETE: { label: "분석완료", color: "#6574F6" },
    FAILED: { label: "분석실패", color: "#EC4D4D" },
  },
};

const color =
  props.mode === "analysis"
    ? statusColorMap.analysis[props.status]?.color || "#999"
    : statusColorMap.project[props.status] || "#999";

const label =
  props.mode === "analysis"
    ? statusColorMap.analysis[props.status]?.label || "알 수 없음"
    : null;
</script>

<template>
  <!-- 프로젝트 상태: 작은 원 표시 -->
  <div v-if="mode === 'project'" :class="[`indicator`, size]">
    <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: color }" />
  </div>

  <!-- 분석 상태: 텍스트 뱃지 -->
  <div v-else class="status-badge" :style="{ backgroundColor: color }">
    {{ label }}
  </div>
</template>

<style scoped>
.indicator.sm {
  margin-top: 4px;
}

.status-badge {
  position: absolute;
  bottom: 12px;
  right: 16px;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 9999px;
}
</style>
