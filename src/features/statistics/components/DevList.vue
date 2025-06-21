<template>
  <div class="flex flex-col gap-1">
    <!-- 포함: 필터 + 선택 배지 + 정렬 -->
    <div class="filter-bar">
      <div class="filter-controls">
        <div class="filter-div">
          <select
            id="stack-select"
            v-model="selectedStack"
            @change="addStack"
            class="filter-dropdown"
          >
            <option disabled value="">기술 스택 선택</option>
            <option value="__ALL__">전체 선택</option>
            <option
              v-for="stack in filteredStackOptions"
              :key="stack"
              :value="stack"
            >
              {{ stack }}
            </option>
          </select>

          <PrimaryButton
            label="필터 초기화"
            bg-color-class="bg-natural-gray"
            hover-color-class="hover:bg-natural-gray-hover"
            text-color-class="text-black"
            :onClick="resetFilters"
          />
        </div>

        <select id="sort-select" v-model="sortOption" class="sort-dropdown">
          <option disabled value="">정렬 기준 선택</option>
          <option value="name">이름순</option>
          <option value="position">직급순</option>
          <option value="grade">등급순</option>
          <option value="status">상태순</option>
        </select>
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

    <div class="developer-header">
      <span class="column profile"></span>
      <span class="column name">직원명</span>
      <span class="column position">직급</span>
      <span class="column department">부서</span>
      <span class="column code">사번</span>
      <span class="column grade">등급</span>
      <span class="column status">상태</span>
    </div>

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
      />

      <div v-if="isLoading" class="loading">로딩 중...</div>
      <div v-else-if="isLastPage && filteredItems.length === 0" class="empty">
        표시할 개발자가 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import DevListItem from "@/components/list/DevListItem.vue";
import TechBadge from "@/components/badge/TechBadge.vue";
import { fetchDevelopers } from "@/api/statistics.js";
import { useInfiniteScroll } from "@/composable/useInfiniteScroll.js";
import PrimaryButton from "@/components/button/PrimaryButton.vue";

const props = defineProps({
  selectedStacks: Array,
  allStacks: Array,
});

const emit = defineEmits(["remove", "add", "reset"]);

const selectedStack = ref("");

const gradePriority = {
  S: 1,
  A: 2,
  B: 3,
  C: 4,
  D: 5,
};

const sortOption = ref("name"); // default to "이름순"

const sortedSelectedStacks = computed(() =>
  [...props.selectedStacks].sort((a, b) => a.localeCompare(b)),
);

const filteredStackOptions = computed(() => {
  return props.allStacks
    .filter((stack) => !props.selectedStacks.includes(stack))
    .sort((a, b) => a.localeCompare(b));
});

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
  emit("reset");
}

function handleRemoveFromFilter(stack) {
  emit("remove", stack);
}

const scrollTarget = ref(null);
const { items, isLoading, isLastPage, reset } = useInfiniteScroll({
  fetchFn: ({ pageParam }) => fetchDevelopers(pageParam),
  scrollTargetRef: scrollTarget,
  threshold: 150,
});

const filteredItems = computed(() => {
  let filtered = items.value;

  if (props.selectedStacks.length > 0) {
    filtered = filtered.filter((dev) =>
      props.selectedStacks.every((stack) => dev.techStacks?.includes(stack)),
    );
  }

  if (sortOption.value === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption.value === "position") {
    filtered.sort((a, b) => a.position.localeCompare(b.position));
  } else if (sortOption.value === "grade") {
    filtered.sort((a, b) => {
      return (gradePriority[a.grade] ?? 999) - (gradePriority[b.grade] ?? 999);
    });
  } else if (sortOption.value === "status") {
    filtered.sort((a, b) => a.status.localeCompare(b.status));
  }

  return filtered;
});

watch(
  () => props.selectedStacks,
  () => reset(),
  { deep: true },
);
</script>

<style scoped>
.developer-header {
  @apply flex items-center bg-[#f5f5f5] px-4 py-2 rounded;
}
.column {
  @apply text-[14px] text-gray-600 font-semibold truncate flex items-center justify-center;
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

.filter-dropdown,
.sort-dropdown {
  @apply appearance-none bg-[#f5f5f5] rounded-md px-[20px] py-[11px] text-bodySm text-black shadow-sm;
  background-image: url("data:image/svg+xml,%3Csvg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.5rem;
  padding-right: 2.5rem;
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
</style>
