<script setup>
defineProps({
  title: String,
  items: Array,
  active: String,
  projectMap: Object,
});

const emit = defineEmits(["select"]);

const handleSelect = (projectCode, project) => {
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
        class="px-3 py-2 rounded text-sm"
        :class="[
          projectMap[code].analysisStatus !== 'COMPLETE'
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : [
                code === active
                  ? 'bg-primary text-white'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-800 cursor-pointer',
              ],
        ]"
      >
        {{ projectMap[code]?.title }}
      </li>
    </ul>
  </div>
</template>
