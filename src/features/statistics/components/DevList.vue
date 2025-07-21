<script setup>
import { ref, computed, watch } from "vue";
import DevListItem from "@/components/list/DevListItem.vue";
import TechBadge from "@/components/badge/TechBadge.vue";
import { fetchDevelopersAndStacks } from "@/api/statistics.js";
import { useInfiniteScroll } from "@/composable/useInfiniteScroll.js";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import SortDropdown from "@/components/dropdown/SortDropdown.vue";
import FilterDropdown from "@/components/dropdown/FilterDropdown.vue";
import { useRouter } from "vue-router";

const props = defineProps({
  selectedStacks: Array,
  allStacks: Array,
});

const emit = defineEmits(["remove", "add", "reset"]);
const router = useRouter();
const selectedStack = ref("");
const sortOption = ref("name");

const sortOptions = [
  { name: "이름순", value: "name" },
  { name: "직급순", value: "position" },
  { name: "등급순", value: "grade" },
  { name: "상태순", value: "status" },
];

const gradePriority = { S: 1, A: 2, B: 3, C: 4, D: 5 };

const sortedSelectedStacks = computed(() =>
  [...props.selectedStacks].sort((a, b) => a.localeCompare(b)),
);

const filteredStackOptions = computed(() =>
  props.allStacks
    .filter((stack) => !props.selectedStacks.includes(stack))
    .sort((a, b) => a.localeCompare(b)),
);

function addStack() {
  if (selectedStack.value === "__ALL__") {
    props.allStacks.forEach((stack) => {
      if (!props.selectedStacks.includes(stack)) emit("add", stack);
    });
  } else if (
    selectedStack.value &&
    !props.selectedStacks.includes(selectedStack.value)
  ) {
    emit("add", selectedStack.value);
  }
  selectedStack.value = "";
}

function resetFilters() {
  selectedStack.value = "";
  emit("reset");
}

function handleRemoveFromFilter(stack) {
  emit("remove", stack);
}

const scrollTarget = ref(null);

const {
  items,
  isLoading,
  isLastPage,
  reset: resetInfiniteScroll,
} = useInfiniteScroll({
  fetchFn: async (pageParam) => {
    const res = await fetchDevelopersAndStacks(pageParam, props.selectedStacks);
    return {
      data: {
        data: res.data.data,
      },
    };
  },
  scrollTargetRef: scrollTarget,
  threshold: 150,
});

// selectedStacks 변경 시 API 재호출
watch(
  () => props.selectedStacks,
  () => {
    resetInfiniteScroll();
  },
  { deep: true },
);

function goToDeveloperDetail(employeeId) {
  if (employeeId) {
    router.push(`/developers/${employeeId}`);
  }
}

// ❗ 필터링은 이미 백엔드에서 하므로 정렬만 적용
const filteredItems = computed(() => {
  let filtered = [...items.value];

  if (sortOption.value === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption.value === "position") {
    filtered.sort((a, b) => a.position.localeCompare(b.position));
  } else if (sortOption.value === "grade") {
    filtered.sort(
      (a, b) =>
        (gradePriority[a.grade] ?? 999) - (gradePriority[b.grade] ?? 999),
    );
  } else if (sortOption.value === "status") {
    filtered.sort((a, b) => a.status.localeCompare(b.status));
  }

  return filtered;
});
</script>

<template>
  <div class="flex flex-col gap-1">
    <!-- 필터 영역 -->
    <div class="filter-bar">
      <div class="filter-controls">
        <div class="filter-div">
          <FilterDropdown
            v-model="selectedStack"
            :options="filteredStackOptions"
            placeholder="기술 스택 선택"
            @change="addStack"
          />
          <PrimaryButton
            label="필터 초기화"
            bg-color-class="bg-natural-gray"
            hover-color-class="hover:bg-natural-gray-hover"
            text-color-class="text-black"
            :onClick="resetFilters"
          />
        </div>
        <SortDropdown
          :options="sortOptions"
          :defaultValue="sortOptions.find((opt) => opt.value === sortOption)"
          @change="onSortChange"
        />
      </div>

      <div class="selected-stacks">
        <TechBadge
          v-for="stack in sortedSelectedStacks"
          :key="stack"
          :label="stack"
          :showClose="true"
          @remove="handleRemoveFromFilter"
        />
      </div>
    </div>

    <!-- 헤더 -->
    <div class="developer-header">
      <span class="column profile"></span>
      <span class="column name">직원명</span>
      <span class="column position">직급</span>
      <span class="column department">부서</span>
      <span class="column code">사번</span>
      <span class="column grade">등급</span>
      <span class="column status">상태</span>
    </div>

    <!-- 개발자 리스트 -->
    <div ref="scrollTarget" class="developer-list-container">
      <DevListItem
        v-for="dev in filteredItems"
        :key="dev.code"
        :profileImageUrl="dev.profileImageUrl"
        :name="dev.name"
        :position="dev.position"
        :department="dev.department"
        :code="dev.code"
        :grade="dev.grade"
        :status="dev.status"
        :techStacks="dev.techStacks"
        @click="goToDeveloperDetail(dev.code)"
      />

      <div v-if="isLoading" class="loading">로딩 중...</div>
      <div v-else-if="isLastPage && filteredItems.length === 0" class="empty">
        표시할 개발자가 없습니다.
      </div>
    </div>
  </div>
</template>

<style scoped>
.developer-header {
  @apply flex items-center bg-natural-gray px-4 py-3 rounded;
}

.column {
  @apply text-bodySm text-support-stack truncate flex items-center justify-center font-bold;
}

.profile {
  @apply w-[43px] ml-[30px] mr-[10px];
}

.name {
  @apply w-[140px];
}

.position {
  @apply w-[100px];
}

.department {
  @apply w-[155px];
}

.code {
  @apply w-[155px];
}

.grade {
  @apply w-[60px];
}

.status {
  @apply w-[130px];
}

.filter-bar {
  @apply flex flex-col mt-10 gap-3 mb-1;
}

.filter-controls {
  @apply flex items-center gap-2 justify-between;
}

.filter-div {
  @apply flex items-center gap-2;
}

.selected-stacks {
  @apply flex flex-wrap gap-2 w-full;
}

.developer-list-container {
  @apply flex flex-col overflow-y-auto max-h-[600px];
}
</style>
