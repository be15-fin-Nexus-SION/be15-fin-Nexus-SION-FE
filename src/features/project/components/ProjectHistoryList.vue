<script setup>
import { useRouter } from "vue-router";
import ProjectHistoryItem from "@/features/project/components/ProjectHistoryItem.vue";
import Pagination from "@/components/Pagination.vue";

const props = defineProps({
  histories: {
    type: Array,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["changePage"]);
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
    <div class="header-row">
      <span class="col project-name">프로젝트명</span>
      <span class="col date">요청일</span>
      <span class="col date">승인/거부일</span>
      <span class="col work-period">기능 구현수</span>
      <span class="col status-badge">현재 상태</span>
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
          :status="item.approvalStatus || 'UNKNOWN'"
          :rejectedReason="item.rejectedReason"
          @click="goToDetail(item.workId)"
        />
      </template>
      <template v-else>
        <div class="no-history-message">
          프로젝트 이력 등록 기록이 없습니다.
        </div>
      </template>
    </div>

    <div v-if="histories.length > 0" class="pagination-wrapper">
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @change="emit('changePage', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  @apply flex flex-col gap-[10px];
}

.header-row {
  @apply flex items-center w-full text-bodySm gap-4 px-4 py-3 border-b border-gray-200;
}

.col {
  @apply flex items-center truncate min-w-0 justify-center;
  flex: 1 1 0;
}

.project-name {
  flex: 2 1 0;
}

.date,
.work-period,
.status-badge {
  flex: 1 1 0;
}

.body {
  @apply flex flex-col gap-[10px];
}

.no-history-message {
  @apply text-center text-bodySm text-gray-400 py-6;
}

.pagination-wrapper {
  @apply mt-10 flex justify-center;
}
</style>
