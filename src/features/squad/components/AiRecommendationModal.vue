<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
  >
    <div class="bg-white rounded-xl shadow-lg w-[320px] p-6">
      <h2 class="text-center font-bold text-lg mb-5">
        AI 추천 기준을 선택하세요
      </h2>

      <div class="space-y-2">
        <button
          v-for="option in options"
          :key="option"
          @click="selectOption(option)"
          :class="[
            'w-full py-2 rounded border text-center font-medium transition',
            selected === option
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          ]"
        >
          {{ option }}
        </button>
      </div>

      <div class="flex justify-between gap-2 mt-6 text-sm">
        <button
          @click="onCancel"
          class="flex-1 py-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
        >
          닫기
        </button>
        <button
          @click="onConfirm"
          class="flex-1 py-2 rounded bg-primary text-white hover:bg-primary-hover transition font-semibold"
        >
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue", "confirm", "close"]);

const options = ["기본", "예산", "기간", "기술스택 점수", "도메인 연관성"];
const selected = ref("예산"); // 기본 선택값

const selectOption = (option) => {
  selected.value = option;
};

const onConfirm = () => {
  emit("confirm", selected.value);
  emit("update:modelValue", false);
};

const onCancel = () => {
  emit("update:modelValue", false);
  emit("close");
};
</script>

<style scoped>
/* Tailwind 스타일 사용 시 별도 작성 필요 없음 */
</style>
