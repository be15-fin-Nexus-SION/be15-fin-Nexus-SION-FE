<script setup>
import { watch } from "vue";

const props = defineProps(["selectedFilters"]);

// 매핑 테이블 정의
const sortByMap = {
  이름: "employeeName",
  등급: "grade",
};

const sortOrderMap = {
  오름차순: "asc",
  내림차순: "desc",
};

// 매핑 처리: 사용자가 한글로 선택했을 때 실제 값 반영
watch(
  () => props.selectedFilters.sortBy,
  (newVal) => {
    if (sortByMap[newVal]) {
      props.selectedFilters.sortBy = sortByMap[newVal];
    }
  },
);

watch(
  () => props.selectedFilters.sortOrder,
  (newVal) => {
    if (sortOrderMap[newVal]) {
      props.selectedFilters.sortOrder = sortOrderMap[newVal];
    }
  },
);
</script>

<template>
  <div
    id="sortModal"
    class="absolute bg-white border border-gray-200 shadow-md rounded p-4 z-10 w-[350px] right-4"
    style="top: 100%"
    @click.stop
  >
    <h4 class="text-lg font-semibold mb-2">정렬</h4>

    <label class="block font-medium mb-1 ml-0">정렬 기준</label>
    <div class="flex gap-2 mb-3">
      <label v-for="opt in ['이름', '등급']" :key="opt">
        <input type="radio" :value="opt" v-model="selectedFilters.sortBy" />
        {{ opt }}
      </label>
    </div>

    <label class="block font-medium mb-1 ml-0">정렬 방향</label>
    <div class="flex gap-2">
      <label>
        <input
          type="radio"
          value="오름차순"
          v-model="selectedFilters.sortOrder"
        />
        오름차순
      </label>
      <label>
        <input
          type="radio"
          value="내림차순"
          v-model="selectedFilters.sortOrder"
        />
        내림차순
      </label>
    </div>
  </div>
</template>
