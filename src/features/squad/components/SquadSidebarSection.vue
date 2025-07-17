<script setup>
const props = defineProps({
  title: String,
  items: Array,
  active: String,
  projectMap: Object,
});

const emit = defineEmits(["select"]);

const handleSelect = (projectCode, project) => {
  console.log("projectMap", props.projectMap.value);
  console.log("items", props.items);
  // todo : 이부분에 squad store 안에 있는 값 초기화. 왜냐면 다른 프로젝트에서 수정하던 스쿼드가 뜨기 떄문
  if (project.analysisStatus === "COMPLETE") {
    emit("select", projectCode);
  }
};
</script>

<template>
  <div>
    <h3 class="text-xs font-semibold text-gray-500 mb-2">{{ title }}</h3>
    <ul class="space-y-1">
      <li
        v-for="code in items"
        :key="code"
        @click="handleSelect(code, projectMap[code])"
        class="px-3 py-2 rounded text-sm flex items-center justify-between"
        :class="[
          projectMap[code].analysisStatus !== 'COMPLETE'
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : code === active
              ? 'bg-primary text-white'
              : 'bg-gray-50 hover:bg-gray-100 text-gray-800 cursor-pointer',
        ]"
      >
        <span class="truncate">
          {{ projectMap[code]?.title }}
        </span>

        <!-- 오른쪽 스피너 -->
        <svg
          v-if="projectMap[code].analysisStatus !== 'COMPLETE'"
          class="w-4 h-4 ml-2 text-gray-400 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      </li>
    </ul>
  </div>
</template>
