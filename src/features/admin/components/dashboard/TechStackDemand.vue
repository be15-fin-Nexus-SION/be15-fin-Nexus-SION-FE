<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  stacks: {
    type: Array,
    required: true,
  },
});

// 최소/최대 count 추출
const minCount = computed(() => Math.min(...props.stacks.map((s) => s.count)));
const maxCount = computed(() => Math.max(...props.stacks.map((s) => s.count)));

// 정규화된 스택 리스트
const normalizedStacks = computed(() =>
  props.stacks.map((stack) => {
    const min = minCount.value;
    const max = maxCount.value;
    const normalized =
      max === min
        ? 1 // 모든 값이 같을 경우 100% 너비
        : (stack.count - min) / (max - min);
    const widthPercent = 30 + normalized * 70; // 30% ~ 100% 범위로 보정
    return {
      ...stack,
      widthPercent,
    };
  }),
);

const router = useRouter();
function handleGoToStatisticPage() {
  router.push("/statistics/stack/popular");
}
</script>

<template>
  <div
    class="p-6 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col"
  >
    <div class="flex items-center mb-4">
      <h3 class="text-[16px] font-bold text-[#222]">📊 기술스택 수요 TOP 5</h3>
      <span
        class="ml-2 text-gray-400 cursor-pointer text-sm text-center"
        @click="handleGoToStatisticPage"
      >
        더보기
      </span>
    </div>

    <ul class="space-y-3">
      <li
        v-for="stack in normalizedStacks"
        :key="stack.name"
        class="relative flex flex-col gap-1 text-sm text-gray-800 bg-gray-100 rounded-lg overflow-hidden px-4 py-2"
      >
        <!-- 배경 막대 (정규화된 너비) -->
        <div
          class="absolute top-0 left-0 h-full bg-primary z-0 transition-all rounded-full"
          :style="{ width: `${stack.widthPercent}%` }"
        ></div>

        <!-- 텍스트 컨텐츠 -->
        <div class="flex justify-between items-center relative z-10">
          <span class="font-semibold text-white">{{ stack.name }}</span>
          <span class="text-black font-light">{{ stack.count }}회</span>
        </div>
      </li>
    </ul>
  </div>
</template>
