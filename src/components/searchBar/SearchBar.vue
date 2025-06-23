<script setup>
import { ref, onMounted } from "vue";
import { getAllTechStacks } from "@/api/statistics.js"; // API 경로 주의

const props = defineProps({
  placeholder: {
    type: String,
    default: "검색어를 입력하세요",
  },
  selectedStacks: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["select"]);

const searchInput = ref("");
const filteredStacks = ref([]);
const allStacks = ref([]);

onMounted(async () => {
  try {
    const res = await getAllTechStacks();
    if (Array.isArray(res.data.data)) {
      allStacks.value = res.data.data;
    } else {
      console.warn("스택 목록이 배열이 아님:", res.data);
      allStacks.value = [];
    }
  } catch (e) {
    console.error("목록 조회 실패:", e);
    allStacks.value = [];
  }
});

function handleInput() {
  if (allStacks.value.length === 0) {
    filteredStacks.value = [];
    return;
  }

  const input = searchInput.value;
  const parts = input.split(",").map((s) => s.trim());
  const last = parts[parts.length - 1].toLowerCase();

  if (!last) {
    filteredStacks.value = [];
    return;
  }

  filteredStacks.value = allStacks.value.filter(
    (stack) =>
      stack.toLowerCase().startsWith(last) &&
      !props.selectedStacks.includes(stack) &&
      !parts.slice(0, -1).some((p) => p.toLowerCase() === stack.toLowerCase()),
  );
}

function handleSubmit() {
  const raw = searchInput.value.trim();
  if (!raw) return;

  const keywords = raw.split(",").map((s) => s.trim().toLowerCase());

  const validStacks = allStacks.value.filter(
    (stack) =>
      keywords.includes(stack.toLowerCase()) &&
      !props.selectedStacks.includes(stack),
  );

  validStacks.forEach((stack) => emit("select", stack));

  searchInput.value = "";
  filteredStacks.value = [];
}

function selectStack(stack) {
  if (!props.selectedStacks.includes(stack)) {
    emit("select", stack);
  }
  searchInput.value = "";
  filteredStacks.value = [];
}
</script>

<template>
  <div class="search-bar-wrapper">
    <div class="search-bar">
      <input
        type="text"
        :placeholder="placeholder"
        v-model="searchInput"
        class="search-input"
        @input="handleInput"
        @keyup.enter="handleSubmit"
      />
      <svg
        class="search-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </div>

    <ul v-if="filteredStacks.length" class="autocomplete-list">
      <li
        v-for="stack in filteredStacks"
        :key="stack"
        class="autocomplete-item"
        @click="selectStack(stack)"
      >
        {{ stack }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.search-bar-wrapper {
  position: relative;
  width: 100%;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px;
  gap: 10px;
  width: 100%;
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 4px;
}

.search-input {
  width: 100%;
  border: none;
  outline: none;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  color: #000;
  background-color: transparent;
}

.search-icon {
  flex-shrink: 0;
  color: #000;
}

.autocomplete-list {
  position: absolute;
  top: 36px;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #eeeeee;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.autocomplete-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}

.autocomplete-item:hover {
  background-color: #f5f5f5;
}
</style>
