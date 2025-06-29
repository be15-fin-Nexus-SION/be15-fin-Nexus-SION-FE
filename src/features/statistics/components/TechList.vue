<script setup>
import { ref, computed, watch, onMounted } from "vue";
import TechBadge from "@/components/badge/TechBadge.vue";
import SortDropdown from "@/components/SortDropdown.vue";
import FilterDropdown from "@/features/statistics/components/FilterDropdown.vue";
import { useInfiniteScroll } from "@/composable/useInfiniteScroll";
import { getTechAdoptionTrendByYear } from "@/api/statistics";

// props: 연도 외부에서 전달
const props = defineProps({
  year: {
    type: Number,
    required: true,
  },
});

// DOM 참조
const listRef = ref(null);

// 선택된 필터 항목
const selectedStack = ref(null);

// fetch 함수: 연도 기반
const fetchFn = async (page) => {
  return await getTechAdoptionTrendByYear({
    year: props.year,
    page: page - 1,
    size: 10,
  });
};

// 무한 스크롤 설정
const {
  items: rawItems,
  isLoading,
  reset,
} = useInfiniteScroll({
  fetchFn,
  scrollTargetRef: listRef,
});

// 연도 변경 시 무한스크롤 초기화
watch(
  () => props.year,
  async () => {
    await reset();
  },
);

// 초기 로딩
onMounted(async () => {
  await reset();
});

// 기술 스택 필터 옵션 (이름순 정렬)
const stackFilterOptions = computed(() => {
  const names = [...new Set(rawItems.value.map((item) => item.techStackName))];
  return names
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({ name, value: name }));
});

// 도입률 데이터 그룹화
const processedList = computed(() => {
  const grouped = {};
  rawItems.value.forEach((item) => {
    const name = item.techStackName;
    const quarter = item.quarter;
    const percentage = item.percentage;

    if (!grouped[name]) {
      grouped[name] = {
        techStackName: name,
        q1: 0,
        q2: 0,
        q3: 0,
        q4: 0,
        totalPercentage: 0,
      };
    }

    grouped[name][`q${quarter}`] = percentage;
    grouped[name].totalPercentage += percentage;
  });
  return Object.values(grouped);
});

// 정렬
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

// 필터 + 정렬 적용
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
    <!-- 정렬 & 필터 -->
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

    <!-- 헤더 -->
    <div class="header">
      <span class="header-text">기술 스택</span>
      <span class="header-text">1분기</span>
      <span class="header-text">2분기</span>
      <span class="header-text">3분기</span>
      <span class="header-text">4분기</span>
      <span class="header-text">총 도입률</span>
    </div>

    <!-- 리스트 -->
    <div class="career-list-container" ref="listRef">
      <div v-for="item in sortedList" :key="item.techStackName" class="item">
        <div class="content">
          <div class="badgeName">
            <TechBadge :label="item.techStackName" />
          </div>
          <span class="content-text">{{ item.q1 }}%</span>
          <span class="content-text">{{ item.q2 }}%</span>
          <span class="content-text">{{ item.q3 }}%</span>
          <span class="content-text">{{ item.q4 }}%</span>
          <span class="content-text font-semibold"
            >{{ item.totalPercentage.toFixed(1) }}%</span
          >
        </div>
      </div>

      <div
        v-if="!sortedList.length && !isLoading"
        class="text-gray-400 text-sm mt-4"
      >
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
