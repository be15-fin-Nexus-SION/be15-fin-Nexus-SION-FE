<script setup>
import { ref, computed, watchEffect, onMounted } from "vue";
import gsap from "gsap";
import { useSquadStore } from "@/stores/squadCreateStore.js";
import SquadCardList from "@/features/squad/components/create/SquadCardList.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import { useRoute, useRouter } from "vue-router";
import {
  getSquadProjectDetail,
  registerManualSquad,
  updateManualSquad,
} from "@/api/squad.js";
import SquadRegisterModal from "@/features/squad/components/modal/SquadRegisterModal.vue";

const squadStore = useSquadStore();
const members = computed(() => squadStore.selectedMembers);
const route = useRoute();

const projectCode = route.params.projectId;
const projectDetail = ref(null);

const showRegisterModal = ref(false); // 등록 정보 확인 모달
const isRegistering = ref(false); // 중복 등록 방지
const registerSuccess = ref(null); // 결과 상태 저장

const router = useRouter();

function handleRegisterConfirm({ title, description }) {
  const jobMap = {};
  projectDetail.value.jobRequirements.forEach((req) => {
    jobMap[req.jobName] = req.projectJobAndId;
  });

  const developers = members.value.map((m) => ({
    employeeId: m.id,
    projectAndJobId: jobMap[m.role],
    ...(m.isLeader ? { isLeader: true } : {}),
  }));

  const payload = {
    title,
    description,
    estimatedDuration: rawDuration.value,
    estimatedCost: rawBudget.value,
    developers,
  };

  // 수정 모드일 경우 squadCode 포함
  if (isEditMode.value) {
    payload.squadCode = squadStore.selectedSquadInfo.id;
  } else {
    payload.projectCode = projectDetail.value.projectCode;
  }

  isRegistering.value = true;

  const submitFn = isEditMode.value ? updateManualSquad : registerManualSquad;

  submitFn(payload)
    .then(() => {
      registerSuccess.value = true;
      squadStore.resetSquad();
      setTimeout(() => {
        router.push("/squads");
      }, 1500);
    })
    .catch((err) => {
      console.error(isEditMode.value ? "수정 실패:" : "등록 실패:", err);
      registerSuccess.value = false;
    })
    .finally(() => {
      showRegisterModal.value = false;
      isRegistering.value = false;
    });
}

// 프로젝트 분석 API 호출
async function fetchProjectDetail() {
  try {
    const res = await getSquadProjectDetail(projectCode);
    if (res.success) {
      projectDetail.value = res.data;
    }
  } catch (e) {
    console.error("프로젝트 분석 데이터 로딩 실패:", e);
  }
}

onMounted(() => {
  fetchProjectDetail();
});

// 애니메이션 대상
const totalBudget = ref(0);
const estimatedDuration = ref(0);
const rawBudget = ref(0);
const rawDuration = ref(0);
const isInitialized = ref(false);

// 경고 처리
const shakeWarning = ref(false);
const showWarningText = ref(false);
const showWarningModal = ref(false);
const warningReason = ref("");

const isEditMode = computed(() => squadStore.selectedSquadInfo?.id !== null);

// 직무 상태 계산
const jobStatus = computed(() => {
  const status = {};
  if (Array.isArray(projectDetail.value?.jobRequirements)) {
    projectDetail.value.jobRequirements.forEach((req) => {
      const current = members.value.filter(
        (m) => m.role === req.jobName,
      ).length;
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

const isBudgetExceeded = computed(() => {
  return (
    isInitialized.value &&
    projectDetail.value?.budgetLimit > 0 &&
    rawBudget.value > projectDetail.value.budgetLimit
  );
});

const isEstimateExceeded = computed(() => {
  return (
    isInitialized.value &&
    projectDetail.value?.estimatedCost > 0 &&
    rawBudget.value > projectDetail.value.estimatedCost
  );
});

const isDurationExceeded = computed(() => {
  return (
    isInitialized.value &&
    projectDetail.value?.durationLimit > 0 &&
    rawDuration.value > projectDetail.value.durationLimit
  );
});

const canSubmit = computed(() => {
  return (
    allJobsSatisfiedExactly.value &&
    !isBudgetExceeded.value &&
    !isDurationExceeded.value
  );
});

watchEffect(() => {
  // selectedMembers가 비어있거나 프로젝트 정보가 없으면 중단
  if (!members.value?.length || !projectDetail.value) return;

  const totalUnitPrice = members.value.reduce(
    (sum, m) => sum + (m.monthlyUnitPrice || 0),
    0,
  );
  const totalProductivity = members.value.reduce(
    (sum, m) => sum + (m.productivity || 0),
    0,
  );
  const effort = projectDetail.value.totalEffort || 0;
  const duration = totalProductivity > 0 ? effort / totalProductivity : 0;
  const budget = Math.round(totalUnitPrice * duration);

  rawBudget.value = budget;
  rawDuration.value = Math.round(duration * 10) / 10;

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

  // 경고 처리
  if (isInitialized.value) {
    if (isBudgetExceeded.value) {
      shakeWarning.value = true;
      showWarningText.value = true;
      warningReason.value = "예산";
      setTimeout(() => (shakeWarning.value = false), 600);
    } else if (isDurationExceeded.value) {
      shakeWarning.value = true;
      showWarningText.value = true;
      warningReason.value = "기간";
      setTimeout(() => (shakeWarning.value = false), 600);
    } else {
      showWarningText.value = false;
      warningReason.value = "";
    }
  }

  isInitialized.value = true;
});

function handleSubmit() {
  showRegisterModal.value = true;
}
</script>

<template>
  <aside class="squad-sidebar" v-if="projectDetail">
    <section class="info-panel text-center text-black">
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
          v-if="projectDetail.budgetLimit > 0"
          class="absolute top-0 right-0 hidden group-hover:block text-xs text-white bg-gray-700 px-2 py-1 rounded"
        >
          예산 상한: ₩{{ projectDetail.budgetLimit.toLocaleString() }}
        </div>
      </div>
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
          v-if="projectDetail.durationLimit > 0"
          class="absolute top-0 right-0 hidden group-hover:block text-xs text-white bg-gray-700 px-2 py-1 rounded"
        >
          기간 상한: {{ projectDetail.durationLimit }}개월
        </div>
      </div>
      <p
        v-if="showWarningText"
        :class="[
          'mt-2 text-sm text-red-500 font-semibold',
          shakeWarning ? 'animate-shake' : '',
        ]"
      >
        프로젝트 예상 {{ warningReason }} 상한선을 넘었습니다
      </p>

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
        {{ isEditMode ? "수정" : "등록" }}
      </button>
    </section>

    <SquadCardList view-mode="card" />

    <ConfirmModal
      v-if="showWarningModal"
      :title="`${warningReason} 초과 경고`"
      :content="`이 스쿼드는 프로젝트 예상 ${warningReason}을(를) 초과했습니다. 그래도 등록하시겠습니까?`"
      confirmText="등록"
      cancelText="취소"
      @confirm="
        () => {
          showWarningModal.value = false;
          showRegisterModal.value = true; // 바로 모달 열기
        }
      "
      @cancel="() => (showWarningModal.value = false)"
    />

    <SquadRegisterModal
      v-if="showRegisterModal"
      :default-title="squadStore.selectedSquadInfo?.title || ''"
      :default-description="squadStore.selectedSquadInfo?.description || ''"
      @submit="handleRegisterConfirm"
      @cancel="() => (showRegisterModal.value = false)"
    />
  </aside>
</template>

<style scoped>
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
.squad-sidebar {
  @apply w-[500px] min-w-[500px] flex flex-col gap-6;
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
</style>
