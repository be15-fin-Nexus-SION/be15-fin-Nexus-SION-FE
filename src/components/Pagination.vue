<script setup>
import { computed } from "vue";

defineOptions({ name: "BasePagination" });

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
});

const emit = defineEmits(["change"]);

const pages = computed(() => {
  const total = props.totalPages;
  const current = props.currentPage;
  const maxVisible = 5;

  let start = Math.max(1, current - Math.floor(maxVisible / 2));
  let end = start + maxVisible - 1;

  if (end > total) {
    end = total;
    start = Math.max(1, end - maxVisible + 1);
  }

  const range = [];
  for (let i = start; i <= end; i++) {
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
  @apply w-8 h-8 rounded text-sm text-gray-400 transition;
}

.page-button:hover {
  @apply text-gray-700;
}

.page-button.active {
  @apply text-gray-900 font-bold;
}

.arrow-button {
  @apply w-8 h-8 rounded text-sm text-gray-400 hover:text-gray-700 transition disabled:opacity-30;
}
</style>
