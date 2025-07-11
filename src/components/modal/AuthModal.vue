<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import { ref } from "vue";

defineProps({
  topLabel: {
    type: String,
    default: "수정하기",
  },
  middleLabel: {
    type: String,
    default: "알림",
  },
  bottomLabel: {
    type: String,
    default: "삭제하기",
  },
});

defineOptions({
  inheritAttrs: false,
});

const emit = defineEmits(["top", "middle", "bottom", "close"]);

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
    <button class="action-button action-button--top" @click="emit('top')">
      <span class="label">{{ topLabel }}</span>
      <slot name="topIcon" />
    </button>
    <button class="action-button action-button--top" @click="emit('middle')">
      <span class="label">{{ middleLabel }}</span>
      <slot name="topIcon" />
    </button>
    <button class="action-button action-button--danger" @click="emit('bottom')">
      <span class="label">{{ bottomLabel }}</span>
      <slot name="bottomIcon" />
    </button>
  </div>
</template>

<style scoped>
.popup-container {
  @apply bg-white rounded-lg shadow-elevated z-50 flex flex-col absolute;
}

.action-button {
  @apply flex items-center justify-center w-[110px] h-[48px] px-4 border-b border-natural-gray cursor-pointer gap-[8px] text-support-stack;
}

.action-button--top:hover {
  @apply text-primary-hover;
}

.action-button--danger:hover {
  @apply text-semantic-warning;
}

.label {
  @apply text-bodySm;
}
</style>
