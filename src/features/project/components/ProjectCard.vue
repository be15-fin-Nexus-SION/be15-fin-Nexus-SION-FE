<script setup>
const props = defineProps({
  project: Object,
});

const statusColorMap = {
  WAITING: "#FFD700",
  IN_PROGRESS: "#00C851",
  COMPLETE: "#FF4444",
  INCOMPLETE: "#9e9e9e",
};
</script>

<template>
  <div class="card-wrapper">
    <div class="flex justify-between items-start">
      <div>
        <h2 class="text-bodyLg font-semibold">{{ project.title }}</h2>
        <p class="text-gray-500 text-sm">
          {{ project.startDate }}~{{ project.endDate }}
        </p>
      </div>
      <div
        class="w-3 h-3 rounded-full mt-1"
        :style="{ backgroundColor: statusColorMap[project.status] }"
      />
    </div>

    <p class="text-gray-700 text-sm mt-2 line-clamp-2">
      {{ project.description }}
    </p>

    <div class="mt-4">
      <span class="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
        {{ project.domainName }} {{ project.hrCount ?? 0 }}명
      </span>
    </div>
  </div>
</template>

<style scoped>
.card-wrapper {
  @apply bg-white shadow-base p-6 rounded-lg w-full;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.25);
}
</style>
