<script setup>
import { onBeforeUnmount, computed } from "vue";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import { getInitialConsonant } from "@/utills/hangul.js";

const props = defineProps({
  jobList: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["deleteJob"]);

function handleDelete(jobName) {
  emit("deleteJob", jobName);
}

// 한글 우선 정렬된 jobList
const sortedJobList = computed(() => {
  return [...props.jobList].sort((a, b) => {
    const aChar = a.trim()[0];
    const bChar = b.trim()[0];
    const aCode = aChar.charCodeAt(0);
    const bCode = bChar.charCodeAt(0);

    const isAKorean = aCode >= 0xac00 && aCode <= 0xd7a3;
    const isBKorean = bCode >= 0xac00 && bCode <= 0xd7a3;

    if (isAKorean && !isBKorean) return -1;
    if (!isAKorean && isBKorean) return 1;

    return a.localeCompare(b, "ko");
  });
});

const letterRefs = new Map();

function registerRef(jobName, el) {
  if (!el) return;
  const initial = getInitialConsonant(jobName.trim()[0]);
  if (!letterRefs.has(initial)) {
    letterRefs.set(initial, el);
  }
}

onBeforeUnmount(() => {
  letterRefs.clear();
});

defineExpose({
  scrollToLetter(letter) {
    const el = letterRefs.get(letter);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  },
});
</script>

<template>
  <div class="job-list-wrapper">
    <div
      v-for="job in sortedJobList"
      :key="job"
      class="job-row-wrapper"
      :ref="(el) => registerRef(job, el)"
    >
      <div class="job-name">{{ job }}</div>
      <div class="button-group">
        <PrimaryButton
          label="삭제"
          bg-color-class="bg-natural-blue-light"
          hover-color-class="hover:bg-natural-blue-light-hover"
          text-color-class="text-black"
          :onClick="() => handleDelete(job)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.job-list-wrapper {
  @apply flex flex-col gap-2 mt-4;
}
.job-row-wrapper {
  @apply flex justify-between items-center px-4 py-2 gap-2 h-[56px] bg-white border-b border-stroke-gray;
}
.job-name {
  @apply h-[24px] text-bodyMd text-[#0D121C];
}
.button-group {
  @apply flex gap-2;
}
</style>
