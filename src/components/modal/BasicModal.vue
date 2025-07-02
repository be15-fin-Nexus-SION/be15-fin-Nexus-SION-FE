<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import { ref } from "vue";

defineProps({
  topLabel: {
    type: String,
    default: "수정하기",
  },
  bottomLabel: {
    type: String,
    default: "삭제하기",
  },
});

defineOptions({
  inheritAttrs: false,
});

const emit = defineEmits(["top", "bottom", "close"]);

const containerRef = ref(null);

const handleClick = (e) => {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    emit("close");
  }
};

onMounted(() => {
  document.addEventListener("mousedown", handleClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClick);
});
</script>

<template>
  <div ref="containerRef" class="popup-container" :style="$attrs.style">
    <button class="action-button" @click="emit('top')">
      <span class="label">{{ topLabel }}</span>
      <slot name="topIcon" />
    </button>
    <button class="action-button" @click="emit('bottom')">
      <span class="label bottom-label">{{ bottomLabel }}</span>
      <slot name="bottomIcon" />
    </button>
  </div>
</template>

<style scoped>
.popup-container {
  @apply bg-white rounded-lg shadow-elevated z-50 flex flex-col absolute;
}

.action-button {
  @apply flex items-center justify-center w-[120px] h-[52px] px-4 border-b border-natural-gray cursor-pointer gap-[8px] text-support-stack;
}

.action-button:hover {
  @apply text-primary-hover;
}

.action-button:hover:nth-child(2) {
  @apply text-semantic-warning;
}

/* ✅ 라벨은 글자 크기만 지정 — 색상 지정 X (부모로부터 상속 받게 함) */
.label {
  @apply text-bodySm;
}

.bottom-label {
  @apply text-bodySm;
}
</style>
