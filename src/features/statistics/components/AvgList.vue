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

      <div
        v-if="isLoading && showLoadingMessage"
        class="text-gray-400 text-sm mt-4"
      >
        로딩 중...
      </div>

      <div
        v-else-if="!isLoading && items.length === 0"
        class="text-gray-400 text-sm mt-4"
      >
        선택된 기술 스택이 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick, defineProps } from "vue";
import TechBadge from "@/components/badge/TechBadge.vue";
import { getStackAvgCareer } from "@/api/statistics.js";

// props
const props = defineProps({
  selectedStacks: Array,
});

// 상태
const items = ref([]);
const isLoading = ref(false);
const localSortOption = ref("techStackName");
const sortDirection = ref("asc");
const page = ref(0);
const size = 10;
const hasNext = ref(true);
const scrollTarget = ref(null);
const showLoadingMessage = ref(false);
let loadingTimeout = null;

// fetch 함수
const fetchData = async ({ reset = false } = {}) => {
  if (!props.selectedStacks || props.selectedStacks.length === 0) {
    items.value = [];
    hasNext.value = false;
    return;
  }

  isLoading.value = true;

  if (reset) {
    showLoadingMessage.value = true;

    if (loadingTimeout) clearTimeout(loadingTimeout);
    loadingTimeout = setTimeout(() => {
      showLoadingMessage.value = false;
    }, 3000);
  }

  try {
    const res = await getStackAvgCareer({
      stackList: props.selectedStacks,
      page: page.value,
      size,
      sort: localSortOption.value,
      direction: sortDirection.value,
    });

    const content = res.data.data.content;
    const isLast = res.data.data.last;

    if (reset) {
      items.value = content;
    } else {
      items.value.push(...content);
    }

    hasNext.value = !isLast;
  } finally {
    isLoading.value = false;
  }
};

// 스크롤 핸들링
const handleScroll = () => {
  const el = scrollTarget.value;
  if (!el || isLoading.value || !hasNext.value) return;

  const { scrollTop, scrollHeight, clientHeight } = el;
  if (scrollTop + clientHeight >= scrollHeight - 150) {
    page.value += 1;
    fetchData();
  }
};

// 정렬 변경 시
const onSortChange = () => {
  page.value = 0;
  hasNext.value = true;
  fetchData({ reset: true });
};

// 표시할 항목
const visibleItems = computed(() => items.value);

// 초기 실행
onMounted(async () => {
  await nextTick();
  scrollTarget.value?.addEventListener("scroll", handleScroll);
  fetchData({ reset: true });
});

// selectedStacks 변경 시 초기화
watch(
  () => props.selectedStacks,
  () => {
    page.value = 0;
    hasNext.value = true;
    fetchData({ reset: true });
  },
  { deep: true },
);
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
