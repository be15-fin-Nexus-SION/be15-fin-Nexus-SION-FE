<template>
  <div class="flex flex-col gap-1">
    <!-- 정렬 드롭다운 -->
    <div class="sort">
      <select
        id="sort-select"
        v-model="localSortOption"
        class="sort-dropdown"
        @change="onSortChange"
      >
        <option disabled value="">정렬 기준 선택</option>
        <option value="techStackName">기술 스택 이름순</option>
        <option value="averageCareer">평균 경력순</option>
        <option value="count">총 인원순</option>
      </select>
    </div>

    <!-- 헤더 -->
    <div class="header">
      <span class="header-text">기술 스택</span>
      <span class="header-text">평균 경력</span>
      <span class="header-text">최단 경력</span>
      <span class="header-text">최장 경력</span>
      <span class="header-text">총 인원수</span>
    </div>

    <!-- 리스트 -->
    <div ref="scrollTarget" class="career-list-container">
      <div
        v-for="item in visibleItems"
        :key="item.techStackName"
        class="item"
        data-testid="avg-list-item"
      >
        <div class="content">
          <div class="techStackName">
            <TechBadge :label="item.techStackName" />
          </div>
          <span class="content-text"
            >{{ item.averageCareer.toFixed(1) }}년</span
          >
          <span class="content-text">{{ item.minCareer }}년</span>
          <span class="content-text">{{ item.maxCareer }}년</span>
          <span class="content-text">{{ item.count }}명</span>
        </div>
      </div>

      <div v-if="isLoading" class="text-gray-400 text-sm mt-4">로딩 중...</div>
      <div
        v-else-if="!isLoading && sortedItems.length === 0"
        class="text-gray-400 text-sm mt-4"
      >
        선택된 기술 스택이 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick } from "vue";
import TechBadge from "@/components/badge/TechBadge.vue";
import { getStackAvgCareer } from "@/api/statistics.js";

// props
const props = defineProps({
  selectedStacks: Array,
});
const emit = defineEmits(["updateSort"]);

// 상태
const allItems = ref([]);
const isLoading = ref(false);
const localSortOption = ref("techStackName");
const visibleCount = ref(10); // 처음 보여줄 개수
const scrollTarget = ref(null);

// 데이터 fetch
const fetchData = async () => {
  if (!props.selectedStacks || props.selectedStacks.length === 0) {
    allItems.value = [];
    return;
  }

  isLoading.value = true;
  try {
    const res = await getStackAvgCareer({
      stackList: props.selectedStacks,
      page: 0,
      size: 9999,
    });
    allItems.value = res.data.data.content;
    visibleCount.value = 10;
  } finally {
    isLoading.value = false;
  }
};

// 정렬된 목록 계산
const sortedItems = computed(() => {
  const sorted = [...allItems.value];
  switch (localSortOption.value) {
    case "techStackName":
      return sorted.sort((a, b) =>
        a.techStackName.localeCompare(b.techStackName),
      );
    case "averageCareer":
      return sorted.sort((a, b) => b.averageCareer - a.averageCareer);
    case "count":
      return sorted.sort((a, b) => b.count - a.count);
    default:
      return sorted;
  }
});

// 화면에 보일 아이템
const visibleItems = computed(() =>
  sortedItems.value.slice(0, visibleCount.value),
);

// 스크롤 핸들링
const handleScroll = () => {
  const el = scrollTarget.value;
  if (!el) return;

  const { scrollTop, scrollHeight, clientHeight } = el;
  if (scrollTop + clientHeight >= scrollHeight - 150) {
    if (visibleCount.value < sortedItems.value.length) {
      visibleCount.value += 10;
    }
  }
};

// 정렬 변경 시 emit
const onSortChange = () => {
  emit("updateSort", localSortOption.value);
  visibleCount.value = 10;
};

// 스크롤 이벤트 등록
onMounted(async () => {
  await nextTick();
  scrollTarget.value?.addEventListener("scroll", handleScroll);
});

// selectedStacks 변경 시 다시 fetch
watch(() => props.selectedStacks, fetchData, { deep: true });
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

.techStackName {
  @apply w-[140px] flex justify-center;
}

.content-text {
  @apply w-[140px] flex items-center justify-center text-bodySm h-[43px];
}

.career-list-container {
  @apply flex flex-col gap-2 max-h-[600px] overflow-y-auto;
}
</style>
