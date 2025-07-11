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
      <span class="project-name">{{ projectName }}</span>
      <span class="start-date">{{ startDate }}</span>
      <span class="end-date">{{ endDate }}</span>
      <span class="work-period">{{ workPeriod }}</span>
      <div class="status-badge">
        <ProjectHistoryStatusBadge :status="status" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dev-list-wrapper {
  @apply box-border border border-stroke-gray rounded-sm flex items-center justify-center px-[17px] py-[17px];
}

.dev-list-inner {
  @apply flex flex-row justify-between gap-[20px];
}

.project-name {
  @apply flex items-center justify-center text-bodySm text-support-stack w-[130px];
}

.start-date {
  @apply flex items-center justify-center text-bodySm text-black text-center w-[130px];
}

.end-date {
  @apply flex items-center justify-center text-bodySm text-black text-center w-[130px];
}

.work-period {
  @apply flex items-center justify-center text-bodySm text-black text-center w-[80px];
}

.status-badge {
  @apply flex items-center justify-center w-[80px];
}
</style>
