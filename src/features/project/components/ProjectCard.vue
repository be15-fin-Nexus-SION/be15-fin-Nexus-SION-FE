<script setup>
import StatusIndicator from "@/features/project/components/StatusIndicator.vue";

const props = defineProps({
  project: Object,
});
</script>

<template>
  <router-link :to="`/projects/${project.projectCode}`">
    <div class="card-wrapper group">
      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-bodyLg font-semibold">{{ project.title }}</h2>
          <p class="text-gray-500 text-sm">
            {{ project.startDate }} ~ {{ project.endDate }}
          </p>
        </div>
        <!-- ✅ 상태 원형 점 -->
        <StatusIndicator :status="project.status" mode="project" size="sm" />
      </div>

      <p class="text-gray-700 text-sm mt-2 line-clamp-2">
        {{ project.description }}
      </p>

      <div class="bottom">
        <div class="mt-4">
          <span
            class="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
          >
            {{ project.domainName }} {{ project.hrCount ?? 0 }}명
          </span>
        </div>

        <div class="w-fit">
          <!-- ✅ 분석 상태 뱃지 -->
          <StatusIndicator
            v-if="project.analysisStatus"
            :status="project.analysisStatus"
            mode="analysis"
          />
        </div>
      </div>
    </div>
  </router-link>
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

.bottom {
  @apply flex justify-between;
}
</style>
