<template>
  <div class="relative">
    <button @click="toggle" class="bg-indigo-600 text-white px-4 py-2 rounded">
      + 스쿼드 추가
    </button>
    <div
      v-if="open"
      class="absolute right-0 mt-1 w-full bg-white border rounded shadow z-50"
    >
      <button class="block w-full text-center px-4 py-2 hover:bg-gray-100">
        AI 추천
      </button>
      <button class="block w-full text-center px-4 py-2 hover:bg-gray-100">
        사용자 지정
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const open = ref(false);
const toggle = () => (open.value = !open.value);
</script>
