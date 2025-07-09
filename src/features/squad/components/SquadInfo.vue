<template>
  <div class="space-y-4">
    <!-- 스쿼드 설명 -->
    <div
      :class="[
        'rounded-lg p-4 shadow-sm',
        isAI
          ? 'ai-border border-gradient'
          : 'bg-gray-50 border border-gray-200',
      ]"
    >
      <h3 class="text-sm font-medium text-gray-500 mb-1">
        {{ isAI ? "스쿼드 추천 이유" : "스쿼드 설명" }}
      </h3>
      <p
        class="text-base font-semibold text-gray-800 whitespace-pre-wrap leading-relaxed"
      >
        {{ description || "설명 없음" }}
      </p>
    </div>

    <!-- 예상 기간 + 총 예산 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 예상 기간 -->
      <div
        class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-center"
      >
        <h4 class="text-sm font-medium text-gray-500 mb-2">예상 기간</h4>
        <p ref="durationRef" class="text-2xl font-bold text-gray-800">0개월</p>
      </div>

      <!-- 총 예산 -->
      <div
        class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-center"
      >
        <h4 class="text-sm font-medium text-gray-500 mb-2">총 예산</h4>
        <p ref="costRef" class="text-2xl font-bold text-gray-800">0원</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import gsap from "gsap";

const props = defineProps({
  description: String,
  period: [String, Number],
  totalCost: [String, Number],
  isAI: Boolean,
});

const durationRef = ref(null);
const costRef = ref(null);

onMounted(() => {
  // 예상 기간 애니메이션
  const durationObj = { val: 0 };
  gsap.to(durationObj, {
    val: Number(props.period) || 0,
    duration: 0.6,
    ease: "power2.out",
    onUpdate: () => {
      if (durationRef.value) {
        const rounded = Math.round(durationObj.val * 10) / 10;
        durationRef.value.textContent = `${rounded}개월`;
      }
    },
  });

  // 총 예산 애니메이션
  const parseCost = (value) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const onlyDigits = value.replace(/[^\d]/g, ""); // 숫자만 추출
      return parseInt(onlyDigits, 10);
    }
    return 0;
  };

  const costVal = parseCost(props.totalCost);

  const costObj = { val: 0 };
  gsap.to(costObj, {
    val: costVal,
    duration: 0.8,
    delay: 0.1,
    ease: "power2.out",
    onUpdate: () => {
      if (costRef.value) {
        const formatted = costObj.val.toLocaleString("ko-KR", {
          maximumFractionDigits: 0,
        });
        costRef.value.textContent = `${formatted}원`;
      }
    },
  });
});
</script>

<style scoped>
.ai-border {
  @apply relative rounded-lg p-4 shadow-sm bg-white;
}

.border-gradient {
  border: 3px solid transparent;
  background-origin: border-box;
  background-clip: padding-box, border-box;
  background-image:
    linear-gradient(white, white),
    linear-gradient(120deg, #823bff, #1268dd, #823bff);
  background-size:
    100% 150%,
    500% 500%;
  background-position:
    center,
    0% 50%;
  border-radius: 0.5rem;
}
</style>
