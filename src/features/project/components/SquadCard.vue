<template>
  <div
    :class="[
      'flex items-center justify-between px-6 py-4 transition-all duration-200',
      approvalStatus !== 'APPROVED' ? 'opacity-50' : 'opacity-100',
      isLeader === 1 && isReplacementMode
        ? 'cursor-not-allowed bg-gray-100'
        : selected
          ? 'cursor-pointer bg-yellow-50 border-yellow-400 border-2 rounded-md'
          : isReplacementMode
            ? 'cursor-pointer hover:bg-yellow-50'
            : 'cursor-pointer bg-[#F7FAFC]',
    ]"
    @click="handleClick"
  >
    <!-- 프로필 + 이름/직무 -->
    <div class="flex items-center gap-4">
      <img
        :src="imageUrl"
        alt="profile"
        class="w-11 h-11 rounded-full object-cover"
      />
      <div>
        <div class="flex items-center gap-1">
          <p class="text-sm font-semibold text-gray-800">{{ name }}</p>
          <!-- 리더 아이콘 -->
          <svg
            v-if="isLeader === 1"
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 16h14v2H5v-2Zm14-8-4 4-3-3-3 3-4-4-1 6h16l-1-6Z" />
          </svg>
          <!-- 승인 상태 아이콘 -->
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
    <p class="text-xs text-gray-500 capitalize">
      {{ statusText }}
    </p>
  </div>
</template>

<script setup>
import { computed } from "vue";

const emit = defineEmits(["click"]);

const props = defineProps({
  name: String,
  role: String,
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
});

const approvalStatusMapping = {
  NOT_REQUESTED: "요청 전",
  PENDING: "승인 대기",
  APPROVED: "승인 완료",
  REJECTED: "승인 거절",
};

const statusText = computed(
  () => approvalStatusMapping[props.approvalStatus] || "알 수 없음",
);

function handleClick() {
  if (props.isLeader === 1) return;
  emit("click");
}
</script>
