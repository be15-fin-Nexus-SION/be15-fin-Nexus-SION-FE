<template>
  <div class="developer-item">
    <div class="developer-content">
      <img class="avatar" :src="profileImageUrl" alt="profile" />

      <span class="column name">{{ name }}</span>
      <span class="column position">{{ position }}</span>
      <span class="column department">{{ department }}</span>
      <span class="column code">{{ code }}</span>
      <span class="column grade">{{ grade }}</span>
      <div class="column status">
        <StatusBadge :status="status" />
      </div>
    </div>
  </div>
</template>

<script setup>
import StatusBadge from "@/components/badge/StatusBadge.vue";

const props = defineProps({
  profileImageUrl: String,
  name: String,
  code: String,
  grade: String,
  position: String,
  department: String,
  status: String,
  techStacks: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.developer-item {
  @apply w-full px-4 bg-white border-b py-[10px] hover:bg-gray-50 cursor-pointer;
}

.developer-content {
  @apply flex items-center w-full;
}

/* 공통 column 스타일 */
.column {
  @apply text-bodySm text-black font-normal text-center truncate flex items-center justify-center h-[43px];
}

.avatar {
  @apply w-[43px] h-[43px] rounded-full object-cover ml-[30px] mr-[10px];
}

/* 너비 재조정 - 전체 100% 기준 */
.name {
  @apply w-[140px];
}

.position {
  @apply w-[100px];
}

.department {
  @apply w-[155px];
}

.code {
  @apply w-[155px];
}

.grade {
  @apply w-[60px];
}

.status {
  @apply w-[130px];
}
</style>
