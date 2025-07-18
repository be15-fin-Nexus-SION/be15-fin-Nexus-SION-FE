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
  showLabel: {
    type: Boolean,
    default: false,
  },
});

const statusColorMap = {
  project: {
    INCOMPLETE: { label: "미완료", color: "#9e9e9e" },
    WAITING: { label: "시작전", color: "#FFD344" },
    IN_PROGRESS: { label: "진행중", color: "#64CF8B" },
    EVALUATION: { label: "평가중", color: "#6574F6" },
    COMPLETE: { label: "종료됨", color: "#EC4D4D" },
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
    : statusColorMap.project[props.status]?.color || "#999";

const label =
  props.mode === "analysis"
    ? statusColorMap.analysis[props.status]?.label || "알 수 없음"
    : statusColorMap.project[props.status]?.label || "알 수 없음";
</script>

<template>
  <div
    v-if="showLabel"
    class="status-badge"
    :style="{ backgroundColor: color }"
  >
    {{ label }}
  </div>
  <div v-else-if="mode === 'project'" :class="[`indicator`, size]">
    <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: color }" />
  </div>
  <div v-else class="status-badge" :style="{ backgroundColor: color }">
    {{ label }}
  </div>
</template>

<style scoped>
.indicator.sm {
  margin-top: 4px;
}

.status-badge {
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 9999px;
  display: inline-block;
}
</style>
