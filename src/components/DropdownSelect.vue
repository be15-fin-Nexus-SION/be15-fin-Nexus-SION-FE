<template>
  <div ref="dropdownRef" class="relative w-full">
    <div class="input cursor-pointer relative" @click="toggleDropdown">
      <span>{{ selectedLabel || placeholder }}</span>
      <svg
        class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>

    <!-- Dropdown list -->
    <ul
      v-if="dropdownOpen"
      class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-auto"
    >
      <li
        v-for="option in options"
        :key="optionKey(option)"
        @click="selectOption(option)"
        class="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
        :class="{
          'bg-blue-50 font-semibold text-blue-600':
            modelValue === optionValue(option),
        }"
      >
        {{ optionLabel(option) }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

const props = defineProps({
  options: Array,
  placeholder: String,
  modelValue: [String, Number, Object],
  optionKeyField: { type: String, default: "code" },
  optionLabelField: { type: String, default: "label" },
});
const emit = defineEmits(["update:modelValue"]);

const dropdownOpen = ref(false);
const dropdownRef = ref(null);

const optionValue = (option) =>
  typeof option === "object" ? option[props.optionKeyField] : option;
const optionLabel = (option) =>
  typeof option === "object" ? option[props.optionLabelField] : option;
const optionKey = (option) => optionValue(option);

const selectedLabel = computed(() => {
  const selected = props.options.find(
    (o) => optionValue(o) === props.modelValue,
  );
  return selected ? optionLabel(selected) : "";
});

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function selectOption(option) {
  emit("update:modelValue", optionValue(option));
  dropdownOpen.value = false;
}

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false;
  }
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside),
);
</script>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400;
}
</style>
