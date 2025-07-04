<script setup>
import { ref, watch } from "vue";
import { getTechStackAutocomplete } from "@/api/squad.js";

const props = defineProps(["selectedFilters"]);
const emit = defineEmits(["removeTechStack", "addTechStack"]);

const keyword = ref("");
const suggestions = ref([]);
const showSuggestions = ref(false);
const activeIndex = ref(-1);

watch(keyword, async (newVal) => {
  if (!newVal.trim()) {
    suggestions.value = [];
    showSuggestions.value = false;
    activeIndex.value = -1;
    return;
  }

  try {
    const res = await getTechStackAutocomplete(newVal);
    suggestions.value = res.data?.data?.techStacks || [];
    showSuggestions.value = true;
    activeIndex.value = 0;
  } catch (e) {
    console.error("자동완성 실패", e);
  }
});

function handleSelectSuggestion(stack) {
  if (!props.selectedFilters.techStacks.includes(stack)) {
    emit("addTechStack", stack);
  }
  keyword.value = "";
  suggestions.value = [];
  showSuggestions.value = false;
  activeIndex.value = -1;
}

function handleKeydown(e) {
  if (!showSuggestions.value || !suggestions.value.length) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeIndex.value = (activeIndex.value + 1) % suggestions.value.length;
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    activeIndex.value =
      (activeIndex.value - 1 + suggestions.value.length) %
      suggestions.value.length;
  } else if (e.key === "Enter") {
    e.preventDefault();
    const selected = suggestions.value[activeIndex.value];
    if (selected) {
      handleSelectSuggestion(selected);
    }
  } else if (e.key === "Escape") {
    showSuggestions.value = false;
    activeIndex.value = -1;
  }
}
</script>

<template>
  <div
    id="filterModal"
    class="absolute bg-white border border-gray-200 shadow-md rounded p-4 z-20 w-[350px] right-4"
    style="top: 100%"
    @click.stop
  >
    <h4 class="text-lg font-semibold mb-2">필터</h4>

    <!-- 기술스택 입력 -->
    <label class="block font-medium mb-1 ml-0">기술스택</label>
    <div class="relative">
      <input
        v-model="keyword"
        type="text"
        placeholder="기술스택 검색"
        class="w-full border rounded px-2 py-1 mb-2"
        @focus="showSuggestions = true"
        @keydown="handleKeydown"
      />
      <ul
        v-if="showSuggestions && suggestions.length"
        class="absolute left-0 w-full border border-gray-300 rounded bg-white shadow-md max-h-40 overflow-y-auto z-20"
      >
        <li
          v-for="(s, idx) in suggestions"
          :key="s"
          class="px-3 py-2 cursor-pointer"
          :class="{ 'bg-gray-100': idx === activeIndex }"
          @mouseenter="activeIndex = idx"
          @mouseleave="activeIndex = -1"
          @click="handleSelectSuggestion(s)"
        >
          {{ s }}
        </li>
      </ul>
    </div>

    <!-- 선택된 기술스택 -->
    <div class="flex flex-wrap gap-1 mb-3">
      <span
        v-for="stack in props.selectedFilters.techStacks"
        :key="stack"
        class="px-2 py-1 bg-gray-700 text-white text-xs rounded-full cursor-pointer"
        @click="$emit('removeTechStack', stack)"
      >
        {{ stack }} ×
      </span>
    </div>

    <!-- 이하 그대로 -->
    <label class="block font-medium mb-1 ml-0">등급</label>
    <div class="flex gap-2 mb-3">
      <label v-for="g in ['S', 'A', 'B', 'C', 'D']" :key="g">
        <input type="checkbox" :value="g" v-model="selectedFilters.grades" />
        {{ g }}
      </label>
    </div>

    <label class="block font-medium mb-1 ml-0">상태</label>
    <div class="flex gap-4 mb-3 ml-0">
      <label
        ><input
          type="checkbox"
          value="대기중"
          v-model="selectedFilters.statuses"
        />
        대기중</label
      >
      <label
        ><input
          type="checkbox"
          value="투입중"
          v-model="selectedFilters.statuses"
        />
        투입중</label
      >
    </div>

    <label class="block font-medium mb-1 ml-0">프리랜서 포함 여부</label>
    <div class="flex gap-3 ml-0">
      <label
        ><input
          type="radio"
          value="포함"
          v-model="selectedFilters.freelancer"
        />
        프리랜서 포함</label
      >
      <label
        ><input
          type="radio"
          value="내부인"
          v-model="selectedFilters.freelancer"
        />
        내부인만</label
      >
      <label
        ><input
          type="radio"
          value="프리랜서"
          v-model="selectedFilters.freelancer"
        />
        프리랜서만</label
      >
    </div>
  </div>
</template>
