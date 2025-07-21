<script setup>
import { ref, computed, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import StatusIndicator from "@/features/project/components/StatusIndicator.vue";

const authStore = useAuthStore();
const memberRole = computed(() => authStore.memberRole);

const emit = defineEmits(["filter-change"]);

const props = defineProps({
  mode: {
    type: String,
    default: "project",
  },
});

const selectedFilters = ref({
  keyword: "",
  period: 36,
  budget: 50000,
  memberCount: 50,
  status: null,
});

const selectedSort = ref("RECENT");

const sortOptions = computed(() => {
  return [
    { label: "최근 수정일순", value: "RECENT" },
    { label: "프로젝트명순", value: "TITLE" },
    { label: "시작일순", value: "START_DATE_DESC" },
    { label: "인원수 많은순", value: "HR_DESC" },
  ];
});

const statusOptions = computed(() => {
  if (props.mode === "history") {
    const commonOptions = [
      { label: "요청중", value: "PENDING", color: "#FFD700" },
      { label: "승인됨", value: "APPROVED", color: "#64CF8B" },
      { label: "거부됨", value: "REJECTED", color: "#EC4D4D" },
    ];

    // 비관리자에게만 '미요청' 상태 추가
    if (memberRole.value !== "ADMIN") {
      return [
        { label: "미요청", value: "NOT_REQUESTED", color: "#A0AEC0" },
        ...commonOptions,
      ];
    }

    return commonOptions;
  } else {
    return [
      { label: "미완료", value: "INCOMPLETE" },
      { label: "시작전", value: "WAITING" },
      { label: "진행중", value: "IN_PROGRESS" },
      { label: "평가중", value: "EVALUATION" },
      { label: "종료됨", value: "COMPLETE" },
    ];
  }
});

const periodFill = computed(
  () => `${(selectedFilters.value.period / 36) * 100}%`,
);
const budgetFill = computed(
  () => `${((selectedFilters.value.budget - 1000) / 49000) * 100}%`,
);
const memberFill = computed(
  () => `${(selectedFilters.value.memberCount / 50) * 100}%`,
);

function handleStatusClick(value) {
  selectedFilters.value.status =
    selectedFilters.value.status === value ? null : value;

  if (props.mode === "history") {
    emit("filter-change", selectedFilters.value);
  }
}

function handleSearchClick() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  emit("filter-change", {
    ...selectedFilters.value,
    sortBy: selectedSort.value,
  });
}

watch(
  [selectedFilters, selectedSort],
  ([newFilters, newSort]) => {
    emit("filter-change", {
      ...newFilters,
      sortBy: newSort,
    });
  },
  { deep: true },
);

watch(
  () => props.mode,
  (newMode) => {
    selectedFilters.value = {
      keyword: "",
      period: 36,
      budget: 50000,
      memberCount: 50,
      status: null,
    };
  },
);
</script>

<template>
  <aside class="sidebar-filter">
    <div class="filter-card">
      <div v-if="props.mode === 'project'" class="mb-6">
        <div class="flex gap-2">
          <input
            type="text"
            v-model="selectedFilters.keyword"
            placeholder="검색어 입력"
            class="search-input"
          />
          <button class="search-button" @click="handleSearchClick">검색</button>
        </div>
      </div>

      <div class="space-y-6">
        <!-- 기간 -->
        <div v-if="props.mode === 'project' && memberRole === 'ADMIN'">
          <p class="text-sm font-semibold text-gray-900 mb-1">
            {{ Math.floor(selectedFilters.period / 12) }} 년
            {{ selectedFilters.period % 12 }} 개월 이하
          </p>
          <input
            type="range"
            min="1"
            max="36"
            v-model="selectedFilters.period"
            class="custom-slider"
            :style="{
              background: `linear-gradient(to right, #111 0%, #111 ${periodFill}, #e5e7eb ${periodFill}, #e5e7eb 100%)`,
            }"
          />
        </div>

        <!-- 예산 -->
        <div v-if="props.mode === 'project' && memberRole === 'ADMIN'">
          <p class="text-sm font-semibold text-gray-900 mb-1">
            {{ selectedFilters.budget.toLocaleString() }} 만원 이하
          </p>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            v-model="selectedFilters.budget"
            class="custom-slider"
            :style="{
              background: `linear-gradient(to right, #111 0%, #111 ${budgetFill}, #e5e7eb ${budgetFill}, #e5e7eb 100%)`,
            }"
          />
        </div>

        <!-- 인원 -->
        <div v-if="props.mode === 'project' && memberRole === 'ADMIN'">
          <p class="text-sm font-semibold text-gray-900 mb-1">
            {{ selectedFilters.memberCount }} 명 이하
          </p>
          <input
            type="range"
            min="1"
            max="50"
            v-model="selectedFilters.memberCount"
            class="custom-slider"
            :style="{
              background: `linear-gradient(to right, #111 0%, #111 ${memberFill}, #e5e7eb ${memberFill}, #e5e7eb 100%)`,
            }"
          />
        </div>

        <!-- 정렬 -->
        <div v-if="props.mode === 'project'">
          <label class="filter-label">정렬</label>
          <div class="space-y-2">
            <label
              v-for="option in sortOptions"
              :key="option.value"
              class="flex items-center space-x-2 text-sm cursor-pointer"
            >
              <input
                type="radio"
                :value="option.value"
                v-model="selectedSort"
                class="accent-primary"
              />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>

        <!-- 상태 -->
        <div>
          <label class="filter-label">상태</label>
          <div class="space-y-2">
            <label
              v-for="option in statusOptions"
              :key="option.value"
              class="flex items-center justify-between text-sm cursor-pointer"
            >
              <div class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  :checked="selectedFilters.status === option.value"
                  @change="handleStatusClick(option.value)"
                  class="accent-primary"
                />
                <span>{{ option.label }}</span>
              </div>

              <!-- ✅ 상태 아이콘 렌더링 방식 분기 처리 -->
              <StatusIndicator
                v-if="props.mode === 'project'"
                :status="option.value"
                mode="project"
                size="sm"
              />
              <span
                v-else
                class="w-2.5 h-2.5 rounded-full"
                :style="{ backgroundColor: option.color }"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-filter {
  @apply w-80 pr-4 py-6;
  position: sticky;
  top: 0;
  height: fit-content;
}

.filter-card {
  @apply bg-white rounded-xl;
  padding: 16px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.25);
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  background-color: #f1f3f6;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  color: #334155;
  outline: none;
}

.search-button {
  background-color: #e7e9f9;
  color: #1e293b;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 12px;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #d8daef;
}

.filter-label {
  @apply block mb-2 text-sm font-bold text-black;
}

.custom-slider {
  width: 100%;
  height: 6px;
  border-radius: 9999px;
  appearance: none;
  outline: none;
  cursor: pointer;
  background-color: #e5e7eb;
}

.custom-slider::-webkit-slider-thumb {
  appearance: none;
  height: 0;
  width: 0;
  opacity: 0;
  pointer-events: auto;
}

.custom-slider::-moz-range-thumb {
  height: 0;
  width: 0;
  opacity: 0;
  pointer-events: auto;
}
</style>
