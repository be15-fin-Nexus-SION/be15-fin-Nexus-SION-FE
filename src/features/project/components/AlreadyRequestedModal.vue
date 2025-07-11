<script setup>
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import { useRouter } from "vue-router";

const router = useRouter();

function goToHistoryList() {
  router.push("/projects/history/list");
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <p class="modal-message">이미 프로젝트 이력 등록이 요청되었습니다.</p>
      <PrimaryButton label="이력 목록으로 이동" :onClick="goToHistoryList" />
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50;
}

.modal-content {
  @apply flex flex-col items-center justify-center bg-white rounded-xl p-8 w-[400px] shadow-lg;
}

.modal-message {
  @apply text-lg mb-6;
}
</style>
