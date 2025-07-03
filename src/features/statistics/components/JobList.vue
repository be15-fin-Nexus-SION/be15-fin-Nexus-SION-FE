<template>
  <div class="flex flex-col gap-1">
    <!-- 정렬 드롭다운 -->
    <div class="filter-bar">
      <div class="filter-controls">
        <div class="filter-div">
          <FilterDropdown
            :options="filteredStackOptions"
            v-model="selectedStack"
            placeholder="직무 선택"
            @change="onFilterChange"
          />
        </div>

        <SortDropdown
          :options="sortOptions"
          :defaultValue="sortOptions.find((opt) => opt.value === sortOption)"
          @change="onSortChange"
        />
      </div>
    </div>

    <!-- 헤더 -->
    <div class="header">
      <span class="header-badge">직무</span>
      <span class="header-text">등록된 인원수</span>
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
import SortDropdown from "@/components/dropdown/SortDropdown.vue";
import FilterDropdown from "@/components/dropdown/FilterDropdown.vue";

const props = defineProps({
  stats: {
    type: Array,
    default: () => [],
  },
});

const selectedStack = ref("__ALL__");
const sortOption = ref("name");

const sortOptions = [
  { name: "직무 이름순", value: "name" },
  { name: "등록된 인원수 순", value: "position" },
];

const onSortChange = (option) => {
  sortOption.value = option.value;
};

const onFilterChange = () => {
  // 필요시 별도 로직 연결 가능 (현재는 없음)
};

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
