<template>
  <div>
    <h3 class="text-sm font-semibold mb-4">최적 인재 추천</h3>

    <div v-if="isLoading" class="text-gray-500">
      추천 인재를 불러오는 중입니다...
    </div>
    <div v-else-if="candidates.length === 0" class="text-sm text-gray-400">
      추천 인재가 없습니다.
    </div>

    <div v-else class="flex flex-col gap-4">
      <div
        v-for="(dev, index) in candidates.slice(0, 5)"
        :key="dev.id"
        @click="select(dev)"
        :class="[
          'p-4 rounded-xl shadow transition-all duration-200 cursor-pointer group border-2',
          selected?.id === dev.id
            ? 'border-blue-600 ring-2 ring-blue-200'
            : 'border-gray-200',
          index === 0 ? 'shadow-xl glow' : '',
        ]"
      >
        <!-- 이름 -->
        <div
          class="text-lg font-bold text-gray-900 mb-3 group-hover:underline tracking-tight"
        >
          {{ index + 1 }}위 · {{ dev.name }}
        </div>

        <!-- 정보 박스 3개 -->
        <div class="flex gap-3">
          <div
            class="flex-1 rounded-md bg-blue-100 text-blue-800 font-semibold text-center py-2 text-sm shadow-inner"
          >
            기술점수<br />
            <span class="text-xl">{{ dev.avgTechScore.toFixed(1) }}</span>
          </div>

          <div
            class="flex-1 rounded-md bg-green-100 text-green-800 font-semibold text-center py-2 text-sm shadow-inner"
          >
            도메인 경험<br />
            <span class="text-xl">{{ dev.domainCount }}</span>
          </div>

          <div
            class="flex-1 rounded-md text-rose-500 font-semibold text-center py-2 text-sm shadow-inner bg-rose-100"
          >
            등급<br />
            <span class="text-xl">{{ dev.grade }}</span>
          </div>
        </div>
      </div>
    </div>

    <button
      :disabled="!selected"
      class="mt-6 w-full bg-primary text-white py-2 rounded disabled:opacity-50"
      @click="emitReplace"
    >
      선택한 인재로 대체하기
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { replaceRecommendation } from "@/api/project.js";
import { useRoute } from "vue-router";

const props = defineProps({
  project: Object,
  leavingMember: Object,
});

const emit = defineEmits(["replace"]);

const candidates = ref([]);
const selected = ref(null);
const isLoading = ref(true);

const select = (dev) => {
  selected.value = dev;
};

const emitReplace = () => {
  emit("replace", {
    oldMember: props.leavingMember,
    newMember: selected.value,
  });
};

const route = useRoute();
const projectCode = route.params.projectCode;

onMounted(async () => {
  try {
    const response = await replaceRecommendation({
      projectCode: projectCode,
      leavingMember: props.leavingMember.employeeId,
    });
    candidates.value = response.data.data;
  } catch (e) {
    console.error("추천 인재 조회 실패", e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Glow 효과 */
.glow {
  box-shadow:
    0 0 8px rgba(101, 116, 246, 0.6),
    0 0 12px rgba(101, 116, 246, 0.4),
    0 0 20px rgba(101, 116, 246, 0.2);
}
</style>
