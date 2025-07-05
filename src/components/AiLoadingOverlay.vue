<script setup>
defineProps({
  visible: { type: Boolean, required: true },
  message: { type: String, default: "AI 분석이 진행중입니다..." },
});
</script>

<template>
  <transition name="fade-scale">
    <div v-if="visible" class="ai-loading-overlay">
      <div class="ai-loading-content">
        <div class="spinner" />
        <p class="ai-message" v-html="message"></p>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.ai-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  @apply bg-white/80 backdrop-blur-md z-50 flex items-center justify-center;
}

.ai-loading-content {
  @apply flex flex-col items-center gap-4 p-8 bg-white rounded-lg shadow-lg border border-gray-200;
  animation: pulseBox 1.5s ease-in-out infinite;
  transform: translate(-50%, -50%);
  position: fixed;
  top: 50%;
  left: 50%;
}

.spinner {
  @apply w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin;
}

.ai-message {
  @apply text-lg text-gray-800 font-medium text-center;
}

/* 애니메이션 */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.5s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@keyframes pulseBox {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 20px 4px rgba(59, 130, 246, 0.4);
  }
}
</style>
