<script setup>
import ProjectHistoryStatusBadge from "@/components/badge/ProjectHistoryStatusBadge.vue";

defineProps({
  projectName: String,
  startDate: String,
  endDate: String,
  workPeriod: Number,
  status: String,
});

const emit = defineEmits(["click"]);
</script>

<template>
  <div
    class="dev-list-wrapper cursor-pointer hover:bg-gray-50"
    @click="$emit('click')"
  >
    <div class="dev-list-inner">
      <span class="col project-name">{{ projectName }}</span>
      <span class="col start-date">{{ startDate }}</span>
      <span class="col end-date">{{ endDate }}</span>
      <span class="col work-period">{{ workPeriod }}</span>
      <div class="col status-badge">
        <ProjectHistoryStatusBadge :status="status" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dev-list-wrapper {
  @apply box-border border border-stroke-gray rounded-sm px-4 py-3;
}

.dev-list-inner {
  @apply flex items-center gap-4 w-full;
}

/* 공통 컬럼 스타일 */
.col {
  @apply flex items-center truncate min-w-0 justify-center;
  flex: 1 1 0;
}

/* 컬럼 비율 설정 */
.project-name {
  flex: 2 1 0;
  @apply text-bodySm text-support-stack;
}

.start-date,
.end-date,
.work-period {
  flex: 1 1 0;
  @apply text-bodySm text-black text-center;
}

.status-badge {
  flex: 1 1 0;
  @apply justify-center;
}
</style>
