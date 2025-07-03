<script setup>
import { computed } from "vue";

defineOptions({
  name: "BasePagination",
});

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["change"]);

const pages = computed(() => {
  const range = [];
  for (let i = 1; i <= props.totalPages; i++) {
    range.push(i);
  }
  return range;
});

function goToPage(page) {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit("change", page);
  }
}
</script>

<template>
  <div class="flex items-center space-x-2">
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="arrow-button"
    >
      &lt;
    </button>

    <button
      v-for="page in pages"
      :key="page"
      @click="goToPage(page)"
      :class="['page-button', page === currentPage ? 'active' : '']"
    >
      {{ page }}
    </button>

    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="arrow-button"
    >
      &gt;
    </button>
  </div>
</template>

<style scoped>
.page-button {
  @apply w-8 h-8 rounded text-sm text-gray-700 hover:bg-gray-200 transition;
}
.page-button.active {
  @apply bg-black text-white font-bold;
}
.arrow-button {
  @apply w-8 h-8 rounded text-sm text-gray-500 hover:bg-gray-100 transition disabled:opacity-30;
}
</style>
