<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  placeholder: { type: String, default: "검색어를 입력하세요" },
  options: { type: Array, default: () => [] },
  onlyOne: { type: Boolean, default: false },
});

const emit = defineEmits(["search"]);

const searchInput = ref("");
const highlightedIndex = ref(-1);

// ✅ 한글 조합 추적 상태
const isComposing = ref(false);
const composingValue = ref("");

const currentInput = computed(() => {
  let input = searchInput.value;
  if (!props.onlyOne) {
    const parts = input.split(",");
    input = parts[parts.length - 1];
  }
  input = input.trim();

  // ✅ 조합 중일 땐 조합중인 값 사용
  if (isComposing.value && composingValue.value) {
    return composingValue.value;
  }
  return input;
});

const alreadySelected = computed(() => {
  if (props.onlyOne) return [];
  return searchInput.value
    .split(",")
    .slice(0, -1)
    .map((s) => s.trim().toLowerCase());
});

const filteredOptions = computed(() => {
  const keyword = currentInput.value.toLowerCase();
  return props.options.filter(
    (opt) =>
      opt.toLowerCase().includes(keyword) &&
      !alreadySelected.value.includes(opt.toLowerCase()),
  );
});

watch(currentInput, () => {
  highlightedIndex.value = -1;
});

function triggerSearch() {
  const rawInputs = props.onlyOne
    ? [searchInput.value]
    : searchInput.value.split(",");
  const validInputs = rawInputs.map((input) => input.trim().toLowerCase());

  const matchedOptions = props.options.filter((opt) =>
    validInputs.includes(opt.toLowerCase()),
  );

  if (matchedOptions.length > 0) {
    if (props.onlyOne) {
      emit("search", matchedOptions[0]);
    } else {
      matchedOptions.forEach((opt) => emit("search", opt));
    }
  }

  searchInput.value = props.onlyOne ? "" : "";
}

function selectOption(option) {
  if (props.onlyOne) {
    searchInput.value = option;
    emit("search", option);
    searchInput.value = "";
    highlightedIndex.value = -1;
  } else {
    const parts = searchInput.value.split(",");
    parts[parts.length - 1] = option;
    searchInput.value = parts.map((p) => p.trim()).join(", ") + ", ";
  }
}

function highlightNext() {
  if (highlightedIndex.value < filteredOptions.value.length - 1) {
    highlightedIndex.value++;
  }
}

function highlightPrev() {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--;
  }
}

function selectHighlighted() {
  if (highlightedIndex.value >= 0) {
    const option = filteredOptions.value[highlightedIndex.value];
    selectOption(option);
    if (props.onlyOne) triggerSearch();
  } else {
    triggerSearch();
  }
}

function handleInput(event) {
  if (
    !props.onlyOne &&
    event.inputType === "insertText" &&
    event.data === ","
  ) {
    highlightedIndex.value = -1;
  }
}

// ✅ 한글 조합 이벤트 핸들러
function handleCompositionStart() {
  isComposing.value = true;
}

function handleCompositionUpdate(e) {
  composingValue.value = e.data;
}

function handleCompositionEnd() {
  isComposing.value = false;
  composingValue.value = "";
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
        @keydown.down.prevent="highlightNext"
        @keydown.up.prevent="highlightPrev"
        @keydown.enter.prevent="selectHighlighted"
        @input="handleInput"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
      />
      <svg
        class="search-icon cursor-pointer"
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        @click="triggerSearch"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </div>

    <ul v-if="currentInput && filteredOptions.length" class="autocomplete-list">
      <li
        v-for="(option, index) in filteredOptions"
        :key="option"
        :class="{ highlighted: index === highlightedIndex }"
        @mousedown.prevent="selectOption(option)"
      >
        {{ option }}
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
  border-radius: 8px;
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
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  border-radius: 0 0 8px 8px;
}

.autocomplete-list li {
  padding: 8px 15px;
  cursor: pointer;
}

.autocomplete-list li.highlighted {
  background-color: #f0f0f0;
  font-weight: bold;
}
</style>
