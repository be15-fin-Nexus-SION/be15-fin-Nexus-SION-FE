<script setup>
import { computed, ref } from "vue";
import TechBadge from "@/components/badge/TechBadge.vue";
import SortDropdown from "@/components/SortDropdown.vue";
import FilterDropdown from "@/features/statistics/components/FilterDropdown.vue";

const props = defineProps({
  year: {
    type: Number,
    required: true,
  },
  list: {
    type: Array,
    required: true,
  },
});

const selectedStack = ref(null);

// 기술 스택 필터 옵션
const stackFilterOptions = computed(() => {
  const names = [...new Set(props.list.map((item) => item.techStackName))];
  return names.sort().map((name) => ({ name, value: name }));
});

// 도입률 데이터 가공
const processedList = computed(() => {
  const grouped = {};

  props.list.forEach((item) => {
    const name = item.techStackName;
    const quarter = item.quarter;
    const percentage = item.percentage;
    const total = item.totalPercentage;

    if (!grouped[name]) {
      grouped[name] = {
        techStackName: name,
        q1: 0,
        q2: 0,
        q3: 0,
        q4: 0,
        totalPercentage: total,
      };
    }

    grouped[name][`q${quarter}`] = percentage;
  });

  return Object.values(grouped);
});

// 정렬 옵션
const localSortOption = ref("totalPercentage");
const sortOptions = [
  { name: "총 도입률순", value: "totalPercentage" },
  { name: "기술 스택 이름순", value: "techStackName" },
  { name: "1분기 도입률순", value: "q1" },
  { name: "2분기 도입률순", value: "q2" },
  { name: "3분기 도입률순", value: "q3" },
  { name: "4분기 도입률순", value: "q4" },
];

const handleSortChange = (option) => {
  localSortOption.value = option.value;
};

// 필터 및 정렬 적용
const sortedList = computed(() => {
  const key = localSortOption.value;
  const filterValue = selectedStack.value?.value;

  const filtered =
    filterValue && filterValue !== "__ALL__"
      ? processedList.value.filter((item) => item.techStackName === filterValue)
      : processedList.value;

  return [...filtered].sort((a, b) => {
    if (typeof a[key] === "number") return b[key] - a[key];
    if (typeof a[key] === "string") return a[key].localeCompare(b[key]);
    return 0;
  });
});
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="sort">
      <FilterDropdown
        :options="stackFilterOptions"
        v-model="selectedStack"
        labelField="name"
        placeholder="기술 스택 선택"
        class="mr-2"
      />
      <SortDropdown
        :options="sortOptions"
        :defaultValue="sortOptions.find((opt) => opt.value === localSortOption)"
        @change="handleSortChange"
      />
    </div>

    <div class="header">
      <span class="header-text">기술 스택</span>
      <span class="header-text">1분기</span>
      <span class="header-text">2분기</span>
      <span class="header-text">3분기</span>
      <span class="header-text">4분기</span>
      <span class="header-text">총 도입률</span>
    </div>

    <div class="career-list-container">
      <div v-for="item in sortedList" :key="item.techStackName" class="item">
        <div class="content">
          <div class="badgeName">
            <TechBadge :label="item.techStackName" />
          </div>
          <span class="content-text">
            {{ Number.isInteger(item.q1) ? item.q1 : item.q1.toFixed(2) }}%
          </span>
          <span class="content-text">
            {{ Number.isInteger(item.q2) ? item.q2 : item.q2.toFixed(2) }}%
          </span>
          <span class="content-text">
            {{ Number.isInteger(item.q3) ? item.q3 : item.q3.toFixed(2) }}%
          </span>
          <span class="content-text">
            {{ Number.isInteger(item.q4) ? item.q4 : item.q4.toFixed(2) }}%
          </span>
          <span class="content-text font-semibold">
            {{
              Number.isInteger(item.totalPercentage)
                ? item.totalPercentage
                : item.totalPercentage.toFixed(2)
            }}%
          </span>
        </div>
      </div>

      <div v-if="!sortedList.length" class="text-gray-400 text-sm mt-4">
        해당 시기에 진행되거나 완료된 프로젝트에 사용된 기술 스택이 없습니다.
      </div>
    </div>
  </div>
</template>

<style scoped>
.sort {
  @apply mt-10 mb-3 flex justify-between;
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
