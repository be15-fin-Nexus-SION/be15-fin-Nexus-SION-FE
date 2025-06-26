<template>
  <div class="flex flex-col gap-1">
    <!-- 정렬 드롭다운 -->
    <div class="sort">
      <select id="sort-select" v-model="localSortOption" class="sort-dropdown">
        <option disabled value="">정렬 기준 선택</option>
        <option value="totalUsageCount">사용 횟수순</option>
        <option value="techStackName">기술 스택 이름순</option>
        <option value="latestProjectName">최근 사용된 프로젝트 이름순</option>
        <option value="topJobName">주요 사용 직무 이름순</option>
      </select>
    </div>

    <!-- 헤더 -->
    <div class="header">
      <span class="header-text">기술 스택</span>
      <span class="header-text">사용 횟수</span>
      <span class="header-text">최근 사용된 프로젝트</span>
      <span class="header-text">주요 사용 직무</span>
    </div>

    <!-- 리스트 -->
    <div class="career-list-container">
      <div v-for="item in sortedList" :key="item.techStackName" class="item">
        <div class="content">
          <div class="badgeName">
            <TechBadge :label="item.techStackName" />
          </div>
          <span class="content-text">{{ item.totalUsageCount }}회</span>
          <span class="content-text">{{ item.latestProjectName }}</span>
          <div class="badgeName">
            <JobBadge :label="item.topJobName" />
          </div>
        </div>
      </div>

      <div v-if="!sortedList.length" class="text-gray-400 text-sm mt-4">
        해당 시기에 진행되거나 완료된 프로젝트에 사용된 기술 스택이 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed } from "vue";
import TechBadge from "@/components/badge/TechBadge.vue";
import JobBadge from "@/components/badge/JobBadge.vue";

const props = defineProps({
  list: {
    type: Array,
    required: true,
  },
});

const localSortOption = ref("totalUsageCount");

const sortedList = computed(() => {
  const key = localSortOption.value;
  return [...props.list].sort((a, b) => {
    if (typeof a[key] === "number") {
      return b[key] - a[key]; // 내림차순
    }
    if (typeof a[key] === "string") {
      return a[key].localeCompare(b[key]); // 오름차순
    }
    return 0;
  });
});
</script>

<style scoped>
.sort {
  @apply mt-10 mb-3 flex justify-end;
}

.sort-dropdown {
  @apply appearance-none bg-[#f5f5f5] rounded-md px-[20px] py-[11px] text-bodySm text-black shadow-sm;
  background-image: url("data:image/svg+xml,%3Csvg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.5rem;
  padding-right: 2.5rem;
}

.header {
  @apply px-8 py-3 flex items-center w-full justify-between bg-natural-gray rounded;
}

.header-text {
  @apply w-[140px] flex items-center justify-center text-bodySm text-support-stack font-bold;
}

.item {
  @apply w-full px-4 py-[10px] bg-white border border-[#eeeeee] rounded;
}

.content {
  @apply flex items-center w-full px-4 justify-between;
}

.badgeName {
  @apply w-[140px] flex justify-center;
}

.content-text {
  @apply w-[140px] flex items-center justify-center text-bodySm h-[43px];
}

.career-list-container {
  @apply flex flex-col gap-2 max-h-[600px] overflow-y-auto;
}
</style>
