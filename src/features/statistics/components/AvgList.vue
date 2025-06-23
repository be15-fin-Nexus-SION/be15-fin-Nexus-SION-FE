<template>
  <div class="list">
    <!-- 🔽 정렬 셀렉트 박스 -->
    <div class="sort">
      <select id="sort-select" v-model="localSortOption" class="sort-dropdown">
        <option disabled value="">정렬 기준 선택</option>
        <option value="techStackName">이름순</option>
        <option value="averageCareer">평균 경력순</option>
        <option value="count">총 인원순</option>
      </select>
    </div>

    <!-- 🧾 테이블 헤더 -->
    <div class="header">
      <span class="header-text">기술 스택</span>
      <span class="header-text">평균 경력</span>
      <span class="header-text">최단 경력</span>
      <span class="header-text">최장 경력</span>
      <span class="header-text">총 인원수</span>
    </div>

    <!-- 👤 리스트 항목 -->
    <div
      v-for="item in sortedCareerStats"
      :key="item.techStackName"
      class="item"
      data-testid="avg-list-item"
    >
      <div class="content">
        <div class="techStackName">
          <TechBadge :label="item.techStackName" />
        </div>
        <span class="content-text">{{ item.averageCareer.toFixed(1) }}년</span>
        <span class="content-text">{{ item.minCareer }}년</span>
        <span class="content-text">{{ item.maxCareer }}년</span>
        <span class="content-text">{{ item.count }}명</span>
      </div>
    </div>

    <div
      v-if="!careerStats || careerStats.length === 0"
      class="text-gray-400 text-sm mt-4"
    >
      선택된 기술 스택이 없습니다.
    </div>
  </div>
</template>

<script setup>
import TechBadge from "@/components/badge/TechBadge.vue";
import { ref, computed } from "vue";

const props = defineProps({
  careerStats: {
    type: Array,
    default: () => [],
  },
});

const localSortOption = ref("techStackName"); // 내부 정렬 기준

const sortedCareerStats = computed(() => {
  const copy = [...props.careerStats];

  if (localSortOption.value === "techStackName") {
    return copy.sort((a, b) => a.techStackName.localeCompare(b.techStackName));
  } else if (localSortOption.value === "averageCareer") {
    return copy.sort((a, b) => b.averageCareer - a.averageCareer);
  } else if (localSortOption.value === "count") {
    return copy.sort((a, b) => b.count - a.count);
  }
  return copy;
});
</script>

<style scoped>
.list {
  @apply flex flex-col gap-2;
}

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
</style>
