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

const analysisStatusMap = {
  PENDING: { label: "분석대기", color: "#808080" },
  PROCEEDING: { label: "분석중", color: "#00C18D" },
  COMPLETE: { label: "분석완료", color: "#6574F6" },
  FAILED: { label: "분석실패", color: "#EC4D4D" },
};
</script>

<template>
  <div class="card-wrapper group">
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

    <div
      v-if="project.analysisStatus"
      class="status-badge"
      :style="{
        backgroundColor:
          analysisStatusMap[project.analysisStatus]?.color || '#ff0000',
      }"
    >
      {{ analysisStatusMap[project.analysisStatus]?.label || "알 수 없음" }}
    </div>
  </div>
</template>

<style scoped>
.card-wrapper {
  @apply bg-white shadow-base p-6 rounded-lg w-full;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.25);
  position: relative;
  min-height: 160px;
  transition: box-shadow 0.3s ease;
}

.card-wrapper:hover {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.28);
}

.status-badge {
  position: absolute;
  bottom: 12px;
  right: 16px;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 9999px;
}
</style>
