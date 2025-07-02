<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "검색어를 입력하세요" },
  options: { type: Array, default: () => [] },
});

const emit = defineEmits(["update:modelValue", "search"]);

const searchInput = ref(props.modelValue);
const highlightedIndex = ref(-1);
const showDropdown = ref(false);
const wrapperRef = ref(null);
const isComposing = ref(false);
const composingValue = ref("");

const currentInput = computed(() => {
  const parts = searchInput.value.split(",");
  let input = parts[parts.length - 1].trim();

  if (isComposing.value && composingValue.value) {
    return composingValue.value;
  }

  return input;
});

const alreadySelected = computed(() => {
  return searchInput.value
    .split(",")
    .slice(0, -1)
    .map((s) => s.trim().toLowerCase());
});

const filteredOptions = computed(() => {
  const keyword = currentInput.value.toLowerCase();
  if (!keyword) return props.options;
  return props.options.filter(
    (opt) =>
      opt.toLowerCase().includes(keyword) &&
      !alreadySelected.value.includes(opt.toLowerCase()),
  );
});

watch(
  () => props.modelValue,
  (val) => {
    if (val !== searchInput.value) searchInput.value = val;
  },
);

watch(searchInput, (val) => {
  emit("update:modelValue", val);

  // ✅ 드롭다운이 이미 닫힌 상태면 다시 열지 않음
  if (!showDropdown.value) return;

  showDropdown.value =
    currentInput.value.length > 0 || filteredOptions.value.length > 0;
});

watch(currentInput, () => {
  highlightedIndex.value = -1;
});

function triggerSearch() {
  const keyword = currentInput.value.trim();
  if (keyword) {
    emit("search", keyword);
  }
  showDropdown.value = false;
}

function selectOption(option) {
  const parts = searchInput.value.split(",");
  parts[parts.length - 1] = option;
  const newValue = parts.map((p) => p.trim()).join(", ");
  searchInput.value = newValue;
  emit("search", option);
  showDropdown.value = false;
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
    selectOption(filteredOptions.value[highlightedIndex.value]);
  } else {
    triggerSearch();
  }
}

function handleInput(event) {
  if (event.inputType === "insertText" && event.data === ",") {
    highlightedIndex.value = -1;
  }
  showDropdown.value = true;
}

function handleClickOutside(event) {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target)) {
    showDropdown.value = false;
  }
}

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

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="search-bar-wrapper" ref="wrapperRef">
    <input
      type="text"
      :placeholder="placeholder"
      v-model="searchInput"
      class="search-input"
      @keydown.down.prevent="highlightNext"
      @keydown.up.prevent="highlightPrev"
      @keydown.enter.prevent="selectHighlighted"
      @input="handleInput"
      @focus="showDropdown = true"
      @compositionstart="handleCompositionStart"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
    />

    <ul v-if="showDropdown && filteredOptions.length" class="autocomplete-list">
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

.search-input {
  @apply w-full px-[15px] py-[18px] border border-natural-gray-hover rounded-md text-bodyMd text-primary-hover;
}

.autocomplete-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
  max-height: 134px;
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
