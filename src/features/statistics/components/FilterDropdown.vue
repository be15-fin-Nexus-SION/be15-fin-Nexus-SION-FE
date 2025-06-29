<script setup>
import { computed } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { CheckIcon, ChevronDownIcon } from "@heroicons/vue/20/solid";

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "항목 선택",
  },
  labelField: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const selected = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit("update:modelValue", val);
    emit("change", val);
  },
});

// 항목 표시용
const getLabel = (item) => {
  if (!item) return "";
  if (props.labelField && typeof item === "object")
    return item[props.labelField];
  return item;
};
</script>

<template>
  <Listbox v-model="selected">
    <div class="relative inline-block">
      <ListboxButton
        class="flex items-center text-sm text-gray-800 gap-1 focus:outline-none"
      >
        <span>
          {{
            selected === "__ALL__"
              ? "전체 선택"
              : !selected
                ? placeholder
                : getLabel(selected)
          }}
        </span>
        <ChevronDownIcon class="w-4 h-4 text-gray-500" />
      </ListboxButton>

      <ListboxOptions
        class="absolute z-10 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-1 space-y-1"
      >
        <ListboxOption
          :value="'__ALL__'"
          class="cursor-pointer px-4 py-2 flex items-center text-sm hover:bg-gray-50"
        >
          <span
            class="w-5 h-5 mr-3 flex-shrink-0 flex items-center justify-center rounded-full border-2 mt-1"
            :class="{
              'border-indigo-500 bg-indigo-500': selected === '__ALL__',
              'border-gray-300': selected !== '__ALL__',
            }"
          >
            <CheckIcon
              v-if="selected === '__ALL__'"
              class="w-3 h-3 text-white"
            />
          </span>
          전체 선택
        </ListboxOption>

        <ListboxOption
          v-for="item in options"
          :key="getLabel(item)"
          :value="item"
          class="cursor-pointer px-4 py-2 flex items-center text-sm hover:bg-gray-50"
        >
          <span
            class="w-5 h-5 mr-3 flex-shrink-0 flex items-center justify-center rounded-full border-2 mt-1"
            :class="{
              'border-indigo-500 bg-indigo-500': selected === item,
              'border-gray-300': selected !== item,
            }"
          >
            <CheckIcon v-if="selected === item" class="w-3 h-3 text-white" />
          </span>
          <span
            class="flex-1 break-words whitespace-normal leading-snug break-all"
          >
            {{ getLabel(item) }}
          </span>
        </ListboxOption>
      </ListboxOptions>
    </div>
  </Listbox>
</template>

<style scoped></style>
