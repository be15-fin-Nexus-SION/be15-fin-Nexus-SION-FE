<script setup>
import { ref, watchEffect } from "vue";

const emit = defineEmits(["filter-change"]);

const selectedFilters = ref({
  keyword: "",
  period: 18,
  budget: 29000,
  memberCount: 20,
  status: null, // ✅ 단일 선택으로 변경
});

const statusOptions = [
  { label: "미완료", value: "INCOMPLETE", color: "#9e9e9e" },
  { label: "종료", value: "COMPLETE", color: "#FF4444" },
  { label: "진행중", value: "IN_PROGRESS", color: "#00C851" },
  { label: "시작 전", value: "WAITING", color: "#FFD700" },
];

// ✅ 체크박스처럼 보이지만 하나만 선택되도록 처리
function handleStatusClick(value) {
  selectedFilters.value.status =
    selectedFilters.value.status === value ? null : value;
}

watchEffect(() => {
  emit("filter-change", selectedFilters.value);
});
</script>

<template>
  <aside class="sidebar-filter">
    <div class="filter-card">
      <!-- 검색 -->
      <div class="mb-6">
        <input
          type="text"
          v-model="selectedFilters.keyword"
          placeholder="검색어 입력"
          class="search-input"
        />
        <button class="search-button">검색</button>
      </div>

      <!-- 슬라이더 필터 -->
      <div class="space-y-6">
        <!-- 기간 -->
        <div>
          <label class="filter-label">기간 (개월)</label>
          <input
            type="range"
            min="1"
            max="36"
            v-model="selectedFilters.period"
            class="slider"
          />
          <p class="slider-value">{{ selectedFilters.period }}개월 미만</p>
        </div>

        <!-- 예산 -->
        <div>
          <label class="filter-label">예산 (만원)</label>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            v-model="selectedFilters.budget"
            class="slider"
          />
          <p class="slider-value">
            {{ selectedFilters.budget.toLocaleString() }} 만원 미만
          </p>
        </div>

        <!-- 인원 -->
        <div>
          <label class="filter-label">인원 (명)</label>
          <input
            type="range"
            min="1"
            max="50"
            v-model="selectedFilters.memberCount"
            class="slider"
          />
          <p class="slider-value">{{ selectedFilters.memberCount }} 명 미만</p>
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
              <span
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
  @apply w-72 p-6;
  position: sticky;
  top: 0;
  height: fit-content;
}

.filter-card {
  @apply bg-white shadow-md rounded-lg p-6;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.25);
}

.search-input {
  @apply w-full border border-gray-300 rounded px-3 py-2 text-sm;
}

.search-button {
  @apply mt-2 w-full bg-gray-100 hover:bg-gray-200 text-sm py-2 rounded;
}

.filter-label {
  @apply block mb-2 text-sm font-semibold text-gray-700;
}

.slider {
  @apply w-full;
}

.slider-value {
  @apply text-xs text-gray-500 mt-1;
}
</style>
