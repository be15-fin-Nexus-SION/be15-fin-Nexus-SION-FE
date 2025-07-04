<script setup>
import { ref, computed, watchEffect } from "vue";
import gsap from "gsap";
import SquadCardList from "@/features/squad/components/create/SquadCardList.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";

const props = defineProps({
  members: Array,
  budgetLimit: Number,
  estimatedCost: Number,
  durationLimit: Number,
  jobRequirements: Array,
  totalEffort: Number,
});

const emit = defineEmits(["remove", "submit"]);

const totalBudget = ref(0);
const estimatedDuration = ref(0);
const rawBudget = ref(0);
const rawDuration = ref(0);
const isInitialized = ref(false);

const shakeWarning = ref(false);
const showWarningText = ref(false); // 메시지 유지용
const showWarningModal = ref(false);
const warningReason = ref("");

// 직무 충족 상태 계산
const jobStatus = computed(() => {
  const status = {};
  if (Array.isArray(props.jobRequirements)) {
    props.jobRequirements.forEach((req) => {
      const current = Array.isArray(props.members)
        ? props.members.filter((m) => m.role === req.jobName).length
        : 0;
      status[req.jobName] = {
        required: req.requiredCount,
        current,
      };
    });
  }
  return status;
});

const allJobsSatisfiedExactly = computed(() =>
  Object.values(jobStatus.value).every(
    ({ current, required }) => current === required,
  ),
);

// 초과 조건
const isBudgetExceeded = computed(() => {
  return (
    isInitialized.value &&
    props.budgetLimit > 0 &&
    rawBudget.value > props.budgetLimit
  );
});

const isEstimateExceeded = computed(
  () =>
    isInitialized.value &&
    props.estimatedCost > 0 &&
    rawBudget.value > props.estimatedCost,
);

const isDurationExceeded = computed(
  () =>
    isInitialized.value &&
    props.durationLimit > 0 &&
    rawDuration.value > props.durationLimit,
);

// 제출 가능 여부
const canSubmit = computed(() => {
  return (
    allJobsSatisfiedExactly.value &&
    !isBudgetExceeded.value &&
    !isDurationExceeded.value
  );
});

// 예상값 계산 및 애니메이션
watchEffect(() => {
  if (!Array.isArray(props.members) || props.totalEffort == null) return;

  const totalUnitPrice = props.members.reduce(
    (sum, m) => sum + (m.monthlyUnitPrice || 0),
    0,
  );
  const totalProductivity = props.members.reduce(
    (sum, m) => sum + (m.productivity || 0),
    0,
  );

  const duration =
    totalProductivity > 0 ? props.totalEffort / totalProductivity : 0;
  const budget = Math.round(totalUnitPrice * duration);

  rawBudget.value = budget;
  rawDuration.value = Math.round(duration * 10) / 10;

  // 애니메이션
  gsap.to(totalBudget, {
    duration: 0.4,
    value: budget,
    roundProps: "value",
  });

  gsap.to(estimatedDuration, {
    duration: 0.4,
    value: duration,
    onUpdate: () => {
      estimatedDuration.value = Math.round(estimatedDuration.value * 10) / 10;
    },
  });

  if (isInitialized.value) {
    if (props.budgetLimit > 0 && budget > props.budgetLimit) {
      shakeWarning.value = true;
      showWarningText.value = true;
      warningReason.value = "예산";
      setTimeout(() => (shakeWarning.value = false), 600);
    } else if (props.durationLimit > 0 && duration > props.durationLimit) {
      showWarningText.value = true;
      shakeWarning.value = true;
      warningReason.value = "기간";
      setTimeout(() => (shakeWarning.value = false), 600);
    }
  }

  isInitialized.value = true;
});

// 제출 처리
function handleSubmit() {
  if (isDurationExceeded.value) {
    warningReason.value = "기간";
    showWarningModal.value = true;
  } else if (isEstimateExceeded.value) {
    warningReason.value = "예산";
    showWarningModal.value = true;
  } else {
    emit("submit");
  }
}
</script>

<template>
  <aside class="squad-sidebar">
    <section class="info-panel text-center text-black">
      <!-- 예산 -->
      <div class="relative group">
        <h3 class="info-title">예상 예산</h3>
        <p
          class="info-value text-3xl font-bold transition-colors"
          :class="{
            'text-red-500': isBudgetExceeded,
            'text-black': !isBudgetExceeded,
          }"
        >
          ₩{{ totalBudget.toLocaleString() }}
        </p>
        <div
          v-if="props.budgetLimit > 0"
          class="absolute top-0 right-0 hidden group-hover:block text-xs text-white bg-gray-700 px-2 py-1 rounded"
        >
          예산 상한: ₩{{ props.budgetLimit.toLocaleString() }}
        </div>
      </div>

      <!-- 기간 -->
      <div class="relative group mt-6">
        <h3 class="info-title">예상 기간</h3>
        <p
          class="info-value text-2xl font-bold transition-colors"
          :class="{
            'text-red-500': isDurationExceeded,
            'text-black': !isDurationExceeded,
          }"
        >
          {{ estimatedDuration }}개월
        </p>
        <div
          v-if="props.durationLimit > 0"
          class="absolute top-0 right-0 hidden group-hover:block text-xs text-white bg-gray-700 px-2 py-1 rounded"
        >
          기간 상한: {{ props.durationLimit }}개월
        </div>
      </div>

      <!-- 경고 메시지 -->
      <p
        v-if="showWarningText"
        :class="[
          'mt-2 text-sm text-red-500 font-semibold',
          shakeWarning ? 'animate-shake' : '',
        ]"
      >
        프로젝트 예상 {{ warningReason }} 상한선을 넘었습니다
      </p>

      <!-- 직무 상태 -->
      <div class="mt-6 w-full flex flex-col gap-2 text-left">
        <div
          v-for="(stat, role) in jobStatus"
          :key="role"
          class="flex justify-between items-center px-4"
        >
          <span class="text-black font-semibold">{{ role }}</span>
          <span
            :class="[
              'font-bold',
              stat.current === stat.required
                ? 'text-green-500'
                : stat.current > stat.required
                  ? 'text-red-500'
                  : 'text-black',
            ]"
          >
            {{ stat.current }}
            <span class="text-black/40 text-sm font-normal">
              / {{ stat.required }}
            </span>
          </span>
        </div>
      </div>

      <!-- 등록 버튼 -->
      <button
        :disabled="!canSubmit"
        @click="handleSubmit"
        class="mt-6 w-full py-2 text-white font-bold rounded transition-all"
        :class="[
          !canSubmit
            ? 'bg-gray-300 cursor-not-allowed opacity-50'
            : 'bg-blue-600 hover:bg-blue-700',
        ]"
      >
        등록
      </button>
    </section>

    <!-- 구성원 카드 리스트 -->
    <SquadCardList
      :members="props.members"
      view-mode="card"
      @remove="(id) => emit('remove', id)"
    />

    <!-- 경고 모달 -->
    <ConfirmModal
      v-if="showWarningModal"
      :title="`${warningReason} 초과 경고`"
      :content="`이 스쿼드는 프로젝트 예상 ${warningReason}을(를) 초과했습니다. 그래도 등록하시겠습니까?`"
      confirmText="등록"
      cancelText="취소"
      @confirm="
        () => {
          showWarningModal.value = false;
          emit('submit');
        }
      "
      @cancel="() => (showWarningModal.value = false)"
    />
  </aside>
</template>

<style scoped>
.squad-sidebar {
  @apply w-[500px] flex flex-col gap-6;
}
.info-panel {
  @apply p-6 bg-white rounded border shadow-sm;
}
.info-title {
  @apply text-base font-semibold;
}
.info-value {
  @apply mt-2;
}
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}
.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>
