<script setup>
import { ref } from "vue";

const props = defineProps({
  roles: {
    type: Array,
    required: true,
  },
  developer: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["select", "close"]);

const selectedRole = ref(null);

function handleConfirm() {
  emit("select", {
    ...props.developer,
    role: selectedRole.value,
  });
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <button class="close-x" @click="$emit('close')">×</button>

      <h2 class="title">직무를 선택해주세요</h2>
      <div class="roles">
        <button
          v-for="role in roles"
          :key="role"
          :class="['role-btn', selectedRole === role ? 'selected' : '']"
          @click="selectedRole = role"
        >
          {{ role }}
        </button>
      </div>
      <div class="modal-actions">
        <button
          class="confirm"
          :disabled="!selectedRole"
          @click="handleConfirm"
        >
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black/30 flex items-center justify-center z-50;
}
.modal-content {
  @apply bg-white p-6 rounded-xl shadow-lg w-[320px] relative;
}

/* ✅ 오른쪽 상단 X 버튼 */
.close-x {
  @apply absolute top-3 right-4 text-2xl text-gray-500 hover:text-black transition;
}

.title {
  @apply text-center font-bold text-xl mb-4;
}
.roles {
  @apply flex flex-col gap-3 mb-5;
}
.role-btn {
  @apply border border-gray-300 py-3 rounded-lg text-center text-black transition-all duration-300;
}
.role-btn.selected {
  @apply bg-indigo-500 text-white font-bold scale-105;
}

.modal-actions {
  @apply flex justify-end gap-4 text-sm;
}
.confirm {
  @apply text-indigo-600 font-semibold disabled:opacity-50;
}
</style>
