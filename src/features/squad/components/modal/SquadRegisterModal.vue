<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  defaultTitle: String,
  defaultDescription: String,
  isEditMode: Boolean,
});
const emit = defineEmits(["submit", "cancel"]);

const localTitle = ref(props.defaultTitle || "");
const localDescription = ref(props.defaultDescription || "");

watch(props, () => {
  localTitle.value = props.defaultTitle || "";
  localDescription.value = props.defaultDescription || "";
});

function submit() {
  if (!localTitle.value.trim()) {
    alert("스쿼드 이름을 입력해주세요.");
    return;
  }
  emit("submit", {
    title: localTitle.value.trim(),
    description: localDescription.value.trim(),
  });
}
</script>

<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-lg w-[450px] p-6">
      <h2 class="text-lg font-bold mb-6">스쿼드 정보</h2>
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <label class="w-[100px] font-medium">스쿼드 이름</label>
          <input
            v-model="localTitle"
            type="text"
            class="flex-1 border rounded-md px-3 py-1.5 focus:outline-blue-400"
            placeholder="스쿼드 이름을 입력하세요"
          />
        </div>
        <div class="flex items-start gap-4">
          <label class="w-[100px] font-medium pt-2">설명</label>
          <textarea
            v-model="localDescription"
            class="flex-1 border rounded-md px-3 py-2 h-24 resize-none focus:outline-blue-400"
            placeholder="스쿼드 설명을 입력하세요"
          ></textarea>
        </div>
      </div>
      <div class="mt-6 text-right space-x-2">
        <button
          class="px-4 py-2 rounded-md border hover:bg-gray-100"
          @click="$emit('cancel')"
        >
          취소
        </button>
        <button
          class="px-5 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
          @click="submit"
        >
          {{ isEditMode ? "수정" : "등록" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
