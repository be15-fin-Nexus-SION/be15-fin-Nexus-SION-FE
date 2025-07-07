<script setup>
import { computed } from "vue";

const props = defineProps({
  type: String,
  projectCodes: Array,
  projectMap: Object,
});

const emit = defineEmits(["close", "select"]);

const typeLabelMap = {
  waiting: "진행 전",
  inprogress: "진행 중",
  complete: "완료",
};

const typeLabel = computed(() => typeLabelMap[props.type] || "전체");

const projects = computed(() =>
  Array.isArray(props.projectCodes)
    ? props.projectCodes
        .map((code) => props.projectMap[String(code)]) // 여기!
        .filter(Boolean)
    : [],
);
</script>

<template>
  <div
    class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
  >
    <div class="bg-white rounded-xl p-6 w-[400px] shadow-lg relative">
      <h3 class="text-lg font-semibold mb-4">{{ typeLabel }} 프로젝트 목록</h3>

      <ul v-if="projects.length" class="space-y-2 max-h-80 overflow-y-auto">
        <li
          v-for="project in projects"
          :key="project.projectCode"
          class="px-3 py-2 rounded text-sm text-center"
          :class="[
            project.analysisStatus !== 'COMPLETE'
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 cursor-pointer hover:bg-gray-200 text-black',
          ]"
          @click="
            project.analysisStatus === 'COMPLETE' &&
            emit('select', project.projectCode)
          "
        >
          {{ project.title }}
        </li>
      </ul>

      <p v-else class="text-center text-sm text-gray-500 py-10">
        해당 상태의 프로젝트가 없습니다.
      </p>

      <button
        @click="emit('close')"
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>
    </div>
  </div>
</template>
