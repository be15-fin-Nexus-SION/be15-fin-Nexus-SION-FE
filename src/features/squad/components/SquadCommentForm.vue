<template>
  <div>
    <h3 class="font-semibold mb-2">📝 의견 남기기</h3>

    <textarea
      v-model="input"
      placeholder="이 스쿼드에 대한 의견이나 요청사항을 입력해주세요."
      class="w-full border rounded-md p-2 text-sm h-28 resize-none"
    />

    <div class="text-right mt-2">
      <button
        class="bg-[#6574F6] text-white px-4 py-2 rounded hover:bg-[#586DDD]"
        :disabled="!input.trim()"
        @click="submit"
      >
        댓글 등록
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const input = ref("");
const emit = defineEmits(["submit"]);

const submit = () => {
  const text = input.value.trim();
  if (!text) return;
  emit("submit", text);
  input.value = "";
};
</script>
