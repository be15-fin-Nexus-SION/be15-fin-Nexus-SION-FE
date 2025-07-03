<template>
  <div class="flex justify-center mt-6 space-x-2">
    <button @click="goTo(1)">&lt;&lt;</button>
    <button @click="goTo(page - 1)" :disabled="page <= 1">&lt;</button>

    <span v-for="p in totalPages" :key="p">
      <button
        @click="goTo(p)"
        :class="[p === page ? 'text-blue-600 font-bold' : '', 'px-2']"
      >
        {{ p }}
      </button>
    </span>

    <button @click="goTo(page + 1)" :disabled="page >= totalPages">&gt;</button>
    <button @click="goTo(totalPages)">&gt;&gt;</button>
  </div>
</template>

<script setup>
defineProps({
  page: Number,
  totalPages: Number,
  goTo: Function,
});
</script>
