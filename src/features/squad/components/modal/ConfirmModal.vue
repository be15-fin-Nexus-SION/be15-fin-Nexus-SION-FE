<script setup>
defineProps({
  title: String,
  content: String,
  confirmText: String,
  cancelText: String,
});
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-[400px] p-6">
      <h3 class="text-lg font-bold mb-4">{{ title }}</h3>
      <p class="text-gray-700 mb-6">{{ content }}</p>
      <div class="flex justify-end gap-2">
        <button class="px-4 py-2 bg-gray-300 rounded" @click="$emit('cancel')">
          취소
        </button>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded"
          @click="$emit('confirm')"
        >
          등록
        </button>
      </div>
    </div>
  </div>
</template>
