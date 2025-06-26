<template>
  <div class="flex flex-col gap-1">
    <!-- 정렬 드롭다운 -->
    <div class="filter-bar">
      <div class="filter-controls">
        <div class="filter-div">
          <select
            id="job-select"
            v-model="selectedStack"
            @change="addStack"
            class="filter-dropdown"
          >
            <option disabled value="">직무 선택</option>
            <option value="__ALL__">전체 선택</option>
            <option v-for="job in filteredStackOptions" :key="job" :value="job">
              {{ job }}
            </option>
          </select>
        </div>

        <select id="sort-select" v-model="sortOption" class="sort-dropdown">
          <option disabled value="">정렬 기준 선택</option>
          <option value="name">직무 이름순</option>
          <option value="position">등록된 인원 수 순</option>
        </select>
      </div>
    </div>

    <!-- 헤더 -->
    <div class="header">
      <span class="header-badge">직무</span>
      <span class="header-text">등록된 인원 수</span>
      <span class="header-badge2">대표 기술 스택</span>
    </div>

    <!-- 리스트 -->
    <div class="career-list-container">
      <div v-for="item in sortedList" :key="item.jobName" class="item">
        <div class="content">
          <div class="badgeName job">
            <JobBadge :label="item.jobName" />
          </div>
          <span class="content-text count">{{ item.memberCount }}명</span>
          <div class="badgeName2">
            <TechBadge :label="item.topTechStack1" />
            <TechBadge :label="item.topTechStack2" />
          </div>
        </div>
      </div>

      <div v-if="!sortedList.length" class="text-gray-400 text-sm mt-4">
        아직 진행된 프로젝트가 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import TechBadge from "@/components/badge/TechBadge.vue";
import JobBadge from "@/components/badge/JobBadge.vue";

const props = defineProps({
  stats: {
    type: Array,
    default: () => [],
  },
});

const selectedStack = ref("__ALL__");
const sortOption = ref("name");

const filteredList = computed(() => {
  if (selectedStack.value === "__ALL__") return props.stats;
  return props.stats.filter((item) => item.jobName === selectedStack.value);
});

const sortedList = computed(() => {
  let list = [...filteredList.value];

  if (sortOption.value === "name") {
    return list.sort((a, b) =>
      a.jobName.localeCompare(b.jobName, ["ko", "en"], { sensitivity: "base" }),
    );
  }

  if (sortOption.value === "position") {
    return list.sort((a, b) => b.memberCount - a.memberCount);
  }

  return list;
});

const filteredStackOptions = computed(() => {
  const allJobNames = props.stats.map((item) => item.jobName);
  return Array.from(new Set(allJobNames)).filter(Boolean);
});

function addStack() {
  // 필터링은 computed에서 처리됨
}
</script>

<style scoped>
.filter-bar {
  @apply flex flex-col mt-10 gap-3 mb-1;
}

.filter-controls {
  @apply flex items-center gap-2 justify-between;
}

.filter-div {
  @apply flex items-center gap-2;
}

.filter-dropdown,
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

.header-badge {
  @apply w-[200px] flex items-center justify-center text-bodySm text-support-stack font-bold;
}

.header-badge2 {
  @apply w-[300px] flex items-center justify-center text-bodySm text-support-stack font-bold;
}

.item {
  @apply w-full px-4 py-[10px] bg-white border border-[#eeeeee] rounded;
}

.content {
  @apply flex items-center w-full px-4 justify-between;
}

.badgeName {
  @apply w-[200px] flex justify-center;
}

.badgeName2 {
  @apply w-[300px] flex justify-center gap-1;
}

.content-text {
  @apply w-[140px] flex items-center justify-center text-bodySm h-[43px];
}

.career-list-container {
  @apply flex flex-col gap-2 max-h-[600px] overflow-y-auto;
}
</style>
