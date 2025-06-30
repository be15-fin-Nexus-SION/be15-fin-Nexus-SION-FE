<template>
  <div class="flex flex-col gap-1">
    <!-- 정렬 드롭다운 -->
    <div class="sort">
      <SortDropdown
        :options="sortOptions"
        :defaultValue="sortOptions.find((opt) => opt.value === localSortOption)"
        @change="handleSortChange"
      />
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
import SortDropdown from "@/components/SortDropdown.vue";

const props = defineProps({
  list: {
    type: Array,
    required: true,
  },
});

const localSortOption = ref("totalUsageCount");

const sortOptions = [
  { name: "사용 횟수순", value: "totalUsageCount" },
  { name: "기술 스택 이름순", value: "techStackName" },
  { name: "최근 사용된 프로젝트 이름순", value: "latestProjectName" },
  { name: "주요 사용 직무 이름순", value: "topJobName" },
];

const handleSortChange = (option) => {
  localSortOption.value = option.value;
};

const sortedList = computed(() => {
  const key = localSortOption.value;
  return [...props.list].sort((a, b) => {
    if (typeof a[key] === "number") {
      return b[key] - a[key];
    }
    if (typeof a[key] === "string") {
      return a[key].localeCompare(b[key]);
    }
    return 0;
  });
});
</script>

<style scoped>
.sort {
  @apply mt-10 mb-3 flex justify-end;
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
