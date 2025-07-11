<script setup>
import { useRouter } from "vue-router";
import ProjectHistoryItem from "@/features/project/components/ProjectHistoryItem.vue";

const props = defineProps({
  histories: {
    type: Array,
    required: true,
  },
});

const router = useRouter();

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("ko-KR");
}

function goToDetail(workId) {
  router.push(`/projects/history/${workId}`);
}
</script>

<template>
  <div class="container">
    <div class="header">
      <span class="project-name">프로젝트명</span>
      <span class="start-date">요청일</span>
      <span class="end-date">승인/거부일</span>
      <span class="work-period">기능 구현수</span>
      <span class="status-badge">현재 상태</span>
    </div>

    <div class="body">
      <template v-if="histories.length > 0">
        <ProjectHistoryItem
          v-for="item in histories"
          :key="item.workId"
          :projectName="item.projectTitle"
          :startDate="formatDate(item.createdAt)"
          :endDate="item.approvedAt ? formatDate(item.approvedAt) : '-'"
          :workPeriod="item.histories.length"
          :status="item.approvalStatus"
          @click="goToDetail(item.workId)"
        />
      </template>
      <template v-else>
        <div class="no-history-message">프로젝트 등록 이력이 없습니다.</div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.container {
  @apply flex flex-col w-full gap-[10px];
}

.header {
  @apply flex flex-row justify-between items-center w-full text-bodySm pb-2 px-[47px] gap-[20px];
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

.no-history-message {
  @apply text-center text-bodySm text-gray-400 py-6;
}

.body {
  @apply flex flex-col gap-[10px];
}
</style>
