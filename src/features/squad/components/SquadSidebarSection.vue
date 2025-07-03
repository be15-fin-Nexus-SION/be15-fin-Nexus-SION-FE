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
          class="w-full text-left px-4 py-4 rounded-md transition-colors duration-200 focus:outline-none"
          :class="[
            code === active
              ? 'bg-primary text-white hover:bg-primary-hover'
              : 'bg-gray-100 text-black hover:bg-gray-200',
          ]"
          @click="onSelect(code)"
        >
          {{ projectMap[code].title }}
        </button>
        <span
          v-else
          class="text-gray-400 px-4 py-2 block border border-gray-300 rounded-md"
        >
          데이터 없음
        </span>
      </li>
    </ul>
  </div>
</template>
