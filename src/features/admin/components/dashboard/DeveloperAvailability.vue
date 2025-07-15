<script setup>
import { computed } from "vue";

const props = defineProps({
  availability: {
    type: Object,
    required: true,
  },
});

const gradeColorMap = {
  S: "bg-gradient-to-r from-yellow-300 to-yellow-500",
  A: "bg-gradient-to-r from-green-300 to-green-500",
  B: "bg-gradient-to-r from-blue-300 to-blue-500",
  C: "bg-gradient-to-r from-purple-300 to-purple-500",
  D: "bg-gradient-to-r from-gray-300 to-gray-500",
};

const enrichedGradeDistribution = computed(() =>
  props.availability.gradeDistribution.map((g) => ({
    ...g,
    color: gradeColorMap[g.grade] || "bg-gray-400",
  })),
);
</script>

<template>
  <div
    class="p-6 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col"
  >
    <h2 class="text-lg font-bold text-gray-800 mb-4">
      🚀 투입 가능 개발자 요약
    </h2>

    <div class="text-sm text-gray-700 mb-3">
      총 투입 가능 인원:
      <span class="font-semibold text-gray-900">
        {{ props.availability.totalAvailable }}명
      </span>
    </div>

    <!-- 등급 분포 -->
    <div class="space-y-3">
      <div
        v-for="g in enrichedGradeDistribution"
        :key="g.grade"
        class="flex items-center gap-3 group"
      >
        <div
          class="w-6 text-lg font-extrabold text-gray-800 cursor-help"
          :title="`${g.grade}급: ${g.count}명`"
        >
          {{ g.grade }}
        </div>
        <div
          class="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden relative"
          :title="`${g.grade}급: ${g.count}명`"
        >
          <div
            class="h-3 rounded-full transition-all duration-700"
            :class="g.color"
            :style="{
              width: `${props.availability.totalAvailable > 0 ? (g.count / props.availability.totalAvailable) * 100 : 0}%`,
            }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 기술스택 -->
    <div class="mt-6">
      <h3 class="text-sm font-semibold text-gray-800 mb-2">💻 가용 기술스택</h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="stack in props.availability.availableStacks.slice(0, 20)"
          :key="stack"
          class="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full shadow-sm hover:shadow transition"
        >
          {{ stack }}
        </span>
      </div>
    </div>
  </div>
</template>
