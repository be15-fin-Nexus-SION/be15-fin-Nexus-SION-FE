<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <h2 class="text-xl font-bold mb-6">
        {{ isEditMode ? "자격증 종류 수정" : "자격증 종류 등록" }}
      </h2>

      <div class="space-y-4">
        <!-- 자격증명 -->
        <div>
          <label class="block text-sm font-semibold mb-1">자격증명</label>
          <input
            type="text"
            v-model="form.certificateName"
            class="input-box"
            :disabled="isEditMode"
            placeholder="예: ADsP"
          />
        </div>

        <!-- 발급기관 -->
        <div>
          <label class="block text-sm font-semibold mb-1">발급기관</label>
          <input
            type="text"
            v-model="form.issuingOrganization"
            class="input-box"
            placeholder="예: 통계청"
          />
        </div>

        <!-- 점수 -->
        <div>
          <label class="block text-sm font-semibold mb-1">점수</label>
          <input
            type="number"
            v-model="form.score"
            class="input-box"
            placeholder="예: 20"
          />
        </div>
      </div>

      <!-- 버튼 -->
      <div class="mt-6 flex justify-end gap-2">
        <button class="btn-cancel" @click="close">취소</button>
        <button class="btn-submit" @click="submit">
          {{ isEditMode ? "수정" : "등록" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["close", "submit"]);
const props = defineProps({
  initialValue: {
    type: Object,
    default: () => ({
      certificateName: "",
      issuingOrganization: "",
      score: null,
    }),
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
});

const form = ref({ ...props.initialValue });

watch(
  () => props.initialValue,
  (newVal) => {
    form.value = { ...newVal };
  },
);

const close = () => emit("close");

const submit = () => {
  if (
    !form.value.certificateName ||
    !form.value.issuingOrganization ||
    form.value.score === null
  ) {
    alert("모든 항목을 입력해주세요.");
    return;
  }
  emit("submit", { ...form.value });
  close();
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.input-box {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.btn-cancel {
  background: #f4f5f7;
  color: #333;
  padding: 8px 16px;
  border-radius: 6px;
}

.btn-submit {
  background: #4f46e5;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
}
</style>
