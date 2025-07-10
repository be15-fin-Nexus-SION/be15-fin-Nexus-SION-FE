<!-- src/components/StatusFilter.vue -->
<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  selectedStatus: String,
  options: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["change"]);

function toggleStatus(value) {
  emit("change", value === props.selectedStatus ? null : value);
}
</script>

<template>
  <div class="status-list">
    <label
      v-for="option in options"
      :key="option.value"
      class="flex items-center text-sm cursor-pointer gap-1"
    >
      <div class="flex items-center gap-1">
        <input
          type="checkbox"
          class="accent-primary"
          :checked="selectedStatus === option.value"
          @change="toggleStatus(option.value)"
        />
        <span>{{ option.label }}</span>
      </div>
      <span
        class="w-2.5 h-2.5 rounded-full"
        :style="{ backgroundColor: option.color }"
      />
    </label>
  </div>
</template>

<style scoped>
.status-list {
  @apply flex gap-5 mb-6;
}
</style>
