<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  availableLetters: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["select"]);

const isExpanded = ref(false);
let leaveTimer = null;

const onEnter = () => {
  clearTimeout(leaveTimer);
  isExpanded.value = true;
};
const onLeave = () => {
  leaveTimer = setTimeout(() => {
    isExpanded.value = false;
  }, 100);
};

const initialsMap = {
  korean: [
    "ㄱ",
    "ㄴ",
    "ㄷ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅅ",
    "ㅇ",
    "ㅈ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ],
  english: Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
};

const initials = computed(() => initialsMap[props.type]);
const isDisabled = (letter) => !props.availableLetters.includes(letter);
</script>

<template>
  <div class="index-bar" @mouseenter="onEnter" @mouseleave="onLeave">
    <div class="compact" v-show="!isExpanded">
      <span>{{ initials[0] }}</span>
      <span>~</span>
      <span>{{ initials[initials.length - 1] }}</span>
    </div>
    <div class="expanded" :class="{ open: isExpanded }">
      <div
        v-for="letter in initials"
        :key="letter"
        class="letter"
        :class="{ disabled: isDisabled(letter) }"
        @click="!isDisabled(letter) && $emit('select', letter)"
      >
        {{ letter }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.index-bar {
  @apply w-[30px] bg-white border border-[#B5B5B5] rounded-full
  box-border flex flex-col items-center p-[10px_5px] z-[10] transition-all relative;
}
.compact {
  @apply flex flex-col items-center gap-[3px];
}
.compact span {
  @apply font-sans text-bodySm text-black flex items-center justify-center w-[20px] h-[17px];
}
.expanded {
  @apply flex flex-col items-center gap-[10px];
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
  overflow: hidden;
  transition: all 0.3s ease;
}
.expanded.open {
  max-height: 1000px;
  opacity: 1;
  transform: translateY(0);
}
.letter {
  @apply font-sans text-bodySm text-black flex items-center justify-center w-[20px] h-[17px]
  cursor-pointer select-none;
}
.letter.disabled {
  @apply text-gray-400 cursor-default;
}
</style>
