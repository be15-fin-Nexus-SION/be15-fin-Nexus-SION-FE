<script setup>
import { ref, watch } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  defaultValue: {
    type: Object,
    required: true
  },
  triggerLabel: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['change'])

const selected = ref(props.defaultValue)

watch(() => props.defaultValue, (newVal) => {
  selected.value = newVal
})

watch(selected, (newVal) => {
  emit('change', newVal)
})
</script>

<template>
  <Listbox v-model="selected">
    <div class="relative inline-block">
      <ListboxButton class="flex items-center text-sm text-gray-800 gap-1 focus:outline-none">
        <span v-if="triggerLabel">{{triggerLabel}}</span>
        <span v-else>{{ selected.name }}</span>
        <ChevronDownIcon class="w-4 h-4 text-gray-500" />
      </ListboxButton>

      <!-- 옵션 리스트 -->
      <ListboxOptions class="absolute z-10 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-1 space-y-1">
        <ListboxOption
            v-for="option in options"
            :key="option.value"
            :value="option"
            class="cursor-pointer px-4 py-2 flex items-center text-sm hover:bg-gray-50"
        >
          <span
              class="w-5 h-5 mr-3 flex items-center justify-center rounded-full border-2"
              :class="{
              'border-indigo-500 bg-indigo-500': selected.value === option.value,
              'border-gray-300': selected.value !== option.value
            }"
          >
            <CheckIcon v-if="selected.value === option.value" class="w-3 h-3 text-white" />
          </span>
          {{ option.name }}
        </ListboxOption>
      </ListboxOptions>
    </div>
  </Listbox>
</template>