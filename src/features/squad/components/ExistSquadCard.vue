<script setup>
import { computed } from "vue";

const { squad } = defineProps({
  squad: Object,
  isSelected: Boolean,
});

const emit = defineEmits(["click"]);

const maxVisibleMembers = 2;

const displayedMembers = computed(() =>
  squad.members.slice(0, maxVisibleMembers),
);

const hiddenMemberCount = computed(() =>
  squad.members.length > maxVisibleMembers
    ? squad.members.length - maxVisibleMembers
    : 0,
);
</script>

<template>
  <div
    @click="emit('click')"
    :class="[
      'relative rounded-lg p-4 flex flex-col h-[350px] w-[260px] mt-2 cursor-pointer transition-transform duration-200 hover:scale-[1.02]',
      isSelected
        ? 'bg-blue-50 border-2 border-primary shadow-lg'
        : squad.aiRecommended
          ? 'bg-white border-0 p-[2px] bg-gradient-to-r from-purple-500 to-sky-400'
          : 'bg-white border border-gray-200 shadow-lg',
    ]"
  >
    <div
      :class="[
        squad.aiRecommended && !isSelected
          ? 'h-full rounded-lg bg-white p-4 relative'
          : 'contents',
      ]"
    >
      <!-- AI 추천 배지 -->
      <div
        v-if="squad.aiRecommended"
        class="absolute top-2 right-2 text-xs text-white px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-sky-400 shadow-sm"
      >
        AI 추천
      </div>

      <!-- 제목 -->
      <h3 class="text-base text-left font-semibold mb-3">
        스쿼드 {{ squad.squadCode?.split("_").pop() }}
      </h3>

      <!-- 팀 멤버 -->
      <div>
        <p class="text-sm text-left font-medium mb-2">
          팀 멤버 ({{ squad.members.length }}명)
        </p>
        <ul>
          <li
            v-for="(member, index) in displayedMembers"
            :key="index"
            :class="[
              'text-sm px-2 py-1 mb-2 rounded-lg w-fit',
              isSelected ? 'bg-white font-bold' : 'bg-gray-100',
            ]"
          >
            {{ member.name }} - {{ member.job }}
          </li>

          <li
            v-if="hiddenMemberCount > 0"
            :class="[
              'text-sm px-2 py-1 mb-1 rounded-lg w-fit',
              isSelected ? 'bg-white font-bold' : 'bg-gray-100',
            ]"
          >
            ... 외 {{ hiddenMemberCount }}명
          </li>
        </ul>
      </div>

      <!-- 예상 기간 / 예산 -->
      <div class="text-sm mt-6 text-left flex flex-col">
        <span class="font-medium">예상 기간:</span>
        <span :class="[isSelected ? 'font-bold' : '']" class="ml-1">
          {{ squad.estimatedPeriod || "-" }}
        </span>
      </div>

      <div class="text-sm my-6 text-left flex flex-col">
        <span class="font-medium">예상 예산:</span>
        <span :class="[isSelected ? 'font-bold' : '']" class="ml-1">
          {{ squad.estimatedCost || "-" }}
        </span>
      </div>
    </div>
  </div>
</template>
