<script setup>
defineProps({
  title: String,
  items: {
    type: Array,
    default: () => [],
  },
  active: String,
  projectMap: Object,
});

const emit = defineEmits(["select", "more"]);

const onSelect = (code) => emit("select", code);
</script>

<template>
  <div class="mb-1">
    <h2 class="text-lg font-semibold mb-4">{{ title }}</h2>
    <ul class="space-y-2">
      <li v-for="code in items" :key="code">
        <button
          v-if="projectMap?.[code]"
          class="w-full text-left px-4 py-1 rounded"
          :class="code === active ? 'bg-blue-500 text-white' : 'bg-white'"
          @click="onSelect(code)"
        >
          {{ projectMap[code].title }}
        </button>
        <span v-else class="text-gray-400 px-4 py-2 block">데이터 없음</span>
      </li>
    </ul>
  </div>
</template>
