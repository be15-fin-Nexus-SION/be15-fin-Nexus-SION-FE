<template>
  <div class="flex flex-col gap-1">
    <!-- 정렬 드롭다운 -->
    <div class="filter-bar">
      <div class="filter-controls">
        <div class="filter-div">
          <FilterDropdown
            :options="filteredStackOptions"
            v-model="selectedGrade"
            placeholder="등급 선택"
          />
        </div>
      </div>
    </div>

    <!-- 헤더 -->
    <div class="header">
      <span class="header-text">등급</span>
      <span class="header-text">최소 연봉</span>
      <span class="header-text">최대 연봉</span>
      <span class="header-text">평균 연봉</span>
    </div>

    <!-- 리스트 -->
    <div class="career-list-container">
      <div v-for="item in sortedList" :key="item.gradeCode" class="item">
        <div class="content">
          <span class="content-text">{{ item.gradeCode }}</span>
          <span class="content-text">{{ item.minSalary }}</span>
          <span class="content-text">{{ item.maxSalary }}</span>
          <span class="content-text">{{ item.avgSalary }}</span>
        </div>
      </div>

      <div v-if="!sortedList.length" class="text-gray-400 text-sm mt-4">
        등급별 연봉 정보가 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import FilterDropdown from "@/components/dropdown/FilterDropdown.vue";

const props = defineProps({
  stats: {
    type: Array,
    default: () => [],
  },
});

const GRADE_ORDER = ["S", "A", "B", "C", "D"];
const selectedGrade = ref("__ALL__");
const sortOption = "grade";

const filteredStackOptions = computed(() => {
  const allGrades = props.stats.map((item) => item.gradeCode);
  const uniqueGrades = Array.from(new Set(allGrades)).filter(Boolean);
  return GRADE_ORDER.filter((grade) => uniqueGrades.includes(grade));
});

const filteredList = computed(() => {
  if (selectedGrade.value === "__ALL__") return props.stats;
  return props.stats.filter((item) => item.gradeCode === selectedGrade.value);
});

const sortedList = computed(() => {
  let list = [...filteredList.value];

  if (sortOption.value === "grade") {
    return list.sort(
      (a, b) =>
        GRADE_ORDER.indexOf(a.gradeCode) - GRADE_ORDER.indexOf(b.gradeCode),
    );
  }

  return list;
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

.item {
  @apply w-full px-4 py-[10px] bg-white border border-[#eeeeee] rounded;
}

.content {
  @apply flex items-center w-full px-4 justify-between;
}

.content-text {
  @apply w-[140px] flex items-center justify-center text-bodySm h-[43px];
}

.career-list-container {
  @apply flex flex-col gap-2 max-h-[600px] overflow-y-auto;
}
</style>
