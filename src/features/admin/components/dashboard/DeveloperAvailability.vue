<script setup>
import { ref, computed } from "vue";
import TechBadge from "@/components/badge/TechBadge.vue";
import { useRouter } from "vue-router";

const props = defineProps({
  availability: {
    type: Object,
    required: true,
  },
});

const showStacks = ref(false);
const toggleStacks = () => (showStacks.value = !showStacks.value);

const gradeColorMap = {
  S: "from-yellow-300 to-yellow-500",
  A: "from-green-300 to-green-500",
  B: "from-blue-300 to-blue-500",
  C: "from-purple-300 to-purple-500",
  D: "from-gray-300 to-gray-500",
};

const gradeColorCodeMap = {
  S: "#facc15",
  A: "#4ade80",
  B: "#60a5fa",
  C: "#a78bfa",
  D: "#9ca3af",
};

const enrichedGradeDistribution = computed(() =>
  props.availability.gradeDistribution.map((g) => ({
    ...g,
    gradient: gradeColorMap[g.grade] || "from-gray-300 to-gray-500",
    colorCode: gradeColorCodeMap[g.grade] || "#9ca3af",
  })),
);

const router = useRouter();
function handleSearchAvailableDeveloper() {
  router.push("/developers?status=available");
}
</script>

<template>
  <div
    class="p-6 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col gap-6"
  >
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-lg font-extrabold text-gray-800 flex items-center gap-2">
        🚀 <span>가용 개발자 대시보드</span>
      </h2>
      <div class="text-xs text-gray-600">실시간 기준</div>
    </div>

    <div
      class="flex justify-center items-center bg-white rounded-2xl shadow-inner py-6 hover:shadow-md hover:scale-[1.02] transition"
      @click="handleSearchAvailableDeveloper"
    >
      <div class="flex flex-col items-center">
        <div class="text-sm text-gray-500">총 투입 가능 인원</div>
        <div class="text-2xl font-bold text-blue-700 mt-2 drop-shadow-sm">
          {{ props.availability.totalAvailable }}명
        </div>
      </div>
    </div>

    <div class="flex justify-around items-center flex-wrap gap-6">
      <div
        v-for="g in enrichedGradeDistribution"
        :key="g.grade"
        class="flex flex-col items-center w-24"
      >
        <div class="relative w-20 h-20">
          <svg class="w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="#e5e7eb"
              stroke-width="10"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="35"
              :stroke="g.colorCode"
              stroke-width="10"
              fill="none"
              stroke-linecap="round"
              :stroke-dasharray="2 * Math.PI * 35"
              :stroke-dashoffset="
                2 * Math.PI * 35 -
                (2 * Math.PI * 35 * g.count) / props.availability.totalAvailable
              "
              class="transition-all duration-700"
            />
          </svg>
          <div
            class="absolute inset-0 flex flex-col items-center justify-center text-gray-800 font-bold text-lg"
          >
            {{ g.grade }}
            <span class="text-xs text-gray-500">{{ g.count }}명</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-4">
      <button
        class="px-5 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow hover:brightness-110 transition"
        @click="toggleStacks"
      >
        {{ showStacks ? "가용 기술스택 숨기기" : "가용 기술스택 보기" }}
      </button>
    </div>

    <transition name="slide-fade">
      <div v-if="showStacks" class="p-4 rounded-xl bg-gray-50 shadow-inner">
        <h3
          class="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2"
        >
          💻 주요 가용 기술스택
        </h3>
        <div class="flex flex-wrap gap-3">
          <TechBadge
            v-for="stack in props.availability.availableStacks.slice(0, 20)"
            :key="stack"
            :label="stack"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
