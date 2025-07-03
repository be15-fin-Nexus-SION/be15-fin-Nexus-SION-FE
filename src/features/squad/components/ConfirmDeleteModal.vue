<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
  >
    <div
      class="bg-white p-8 rounded-xl shadow-lg w-[300px] text-center relative"
    >
      <!-- 닫기 버튼 -->
      <button
        @click="$emit('close')"
        class="absolute top-2 right-3 text-lg text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>

      <!-- 메시지 -->
      <div class="flex flex-col justify-between items-center">
        <p class="text-base text-gray-800 mb-4">{{ message }}</p>

        <!-- 확인 버튼 -->
        <div class="flex justify-center gap-2">
          <button
            @click="$emit('close')"
            class="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            취소
          </button>
          <PrimaryButton @click="$emit('confirm')" :label="confirmText" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PrimaryButton from "@/components/button/PrimaryButton.vue";

defineProps({
  message: {
    type: String,
    default: "정말 삭제하시겠습니까?",
  },
  confirmText: {
    type: String,
    default: "삭제",
  },
});

defineEmits(["confirm", "close"]);
</script>
