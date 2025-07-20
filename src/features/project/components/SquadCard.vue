<template>
  <div
    :class="[
      'flex items-center justify-between px-6 py-4 transition-all duration-200 relative group',
      isEvaluationMode &&
      approvalStatus === 'NOT_REQUESTED' &&
      employeeId !== myEmployeeId &&
      role === 'ADMIN'
        ? 'opacity-50'
        : 'opacity-100',
      approvalStatus === 'APPROVED'
        ? 'bg-green-50'
        : isLeader === 1 && isReplacementMode
          ? 'cursor-not-allowed bg-gray-100'
          : isClickable
            ? 'cursor-pointer hover:bg-secondary-blue'
            : 'cursor-default bg-[#F7FAFC]',
      selected && isClickable ? 'bg-secondary-blue rounded-md' : '',
    ]"
    @click="handleClick"
  >
    <div class="flex items-center gap-4">
      <img
        :src="imageUrl"
        alt="profile"
        class="w-11 h-11 rounded-full object-cover"
      />
      <div>
        <div class="flex items-center gap-1">
          <p class="text-sm font-semibold text-gray-800">{{ name }}</p>
          <svg
            v-if="isLeader === 1"
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 16h14v2H5v-2Zm14-8-4 4-3-3-3 3-4-4-1 6h16l-1-6Z" />
          </svg>
          <svg
            v-if="approvalStatus === 'APPROVED'"
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8.25 8.25a1 1 0 01-1.414 0l-4.25-4.25a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <p class="text-xs text-blue-600">{{ role }}</p>
      </div>
    </div>

    <template v-if="isEvaluationMode">
      <!-- 항상 보이는 상태 텍스트 -->
      <p class="text-xs text-support-stack_dark capitalize pr-3">
        {{ statusText }}
      </p>

      <!-- PENDING 상태일 때 호버하면 버튼 등장 -->
      <button
        v-if="
          approvalStatus !== 'NOT_REQUESTED' &&
          (employeeId === myEmployeeId || viewerRole === 'ADMIN')
        "
        @click.stop="goToHistory(historyId)"
        class="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-2 text-xs font-semibold text-white bg-primary rounded-md transform translate-x-full group-hover:translate-x-[-10%] transition-all duration-300"
      >
        프로젝트 이력 내역 확인하기 →
      </button>

      <!--본인일 때 호버하면 버튼 등장 -->
      <button
        v-else-if="employeeId === myEmployeeId"
        @click.stop="goToRegister(historyId)"
        class="absolute right-6 top-1/2 -translate-y-1/2 px-4 py-2 text-xs font-semibold text-primary bg-white border border-primary rounded-md transform translate-x-full group-hover:translate-x-0 transition-all duration-300"
      >
        요청하기 →
      </button>
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";

const emit = defineEmits(["click"]);
const router = useRouter();
const authStore = useAuthStore();
const myEmployeeId = authStore.memberId;

const props = defineProps({
  name: String,
  role: String,
  viewerRole: String,
  isLeader: Number,
  imageUrl: String,
  selected: {
    type: Boolean,
    default: false,
  },
  isReplacementMode: {
    type: Boolean,
    default: false,
  },
  approvalStatus: {
    type: String,
    default: "NOT_REQUESTED",
  },
  isEvaluationMode: {
    type: Boolean,
    default: false,
  },
  historyId: {
    type: String,
    required: false,
  },
  employeeId: {
    type: String,
    required: true,
  },
});

const approvalStatusMapping = {
  NOT_REQUESTED: "요청 전",
  PENDING: "승인 대기",
  APPROVED: "승인 완료",
  REJECTED: "승인 거절",
};

const statusText = computed(() => {
  if (
    props.isEvaluationMode &&
    props.approvalStatus === "NOT_REQUESTED" &&
    props.employeeId === myEmployeeId
  ) {
    return "요청하기";
  }
  return approvalStatusMapping[props.approvalStatus] || "알 수 없음";
});

const isClickable = computed(() => {
  return props.viewerRole === "ADMIN" || props.employeeId === myEmployeeId;
});

function handleClick() {
  if (!isClickable.value) return;

  if (props.isReplacementMode) {
    emit("click");
  } else {
    router.push(`/developers/${props.employeeId}`);
  }
}

function goToRegister(id) {
  router.push(`/projects/history/register/${id}`);
}

function goToHistory(id) {
  router.push(`/projects/history/${id}`);
}
</script>
