<template>
  <div class="page-layout">
    <SidebarWrapper viewType="developerSelf" />

    <div class="content-wrapper">
      <h1 class="text-2xl font-bold mb-6">추천 교육 목록</h1>

      <div v-if="isLoading" class="text-gray-500">
        추천 교육을 불러오는 중입니다...
      </div>
      <div v-else-if="pagedTrainings.length === 0" class="text-gray-500">
        추천 교육이 없습니다.
      </div>

      <!-- 추천 목록 -->
      <div v-else class="grid grid-cols-3 gap-x-40 gap-y-8">
        <TrainingCard
          v-for="training in pagedTrainings"
          :key="training.trainingId"
          :title="training.trainingName"
          :description="training.trainingDescription"
          :reason="training.recommendationReason"
          :thumbnailUrl="training.imageUrl"
          :category="training.category"
          :organization="training.organization"
          :videoUrl="training.videoUrl"
        />
      </div>

      <!-- 페이지네이션 -->
      <div class="mt-6 flex justify-center">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @change="changePage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import Pagination from "@/components/Pagination.vue";
import TrainingCard from "@/features/developer/components/TrainingCard.vue";
import { useTrainingStore } from "@/stores/useTrainingStore";

// 스토어
const trainingStore = useTrainingStore();
const { trainings, isLoading } = storeToRefs(trainingStore);

// 페이지네이션
const currentPage = ref(1);
const itemsPerPage = 6;

const totalPages = computed(() =>
  Math.ceil(trainings.value.length / itemsPerPage),
);

const pagedTrainings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return trainings.value.slice(start, start + itemsPerPage);
});

const changePage = (page) => {
  currentPage.value = page;
};

// 데이터 로딩
onMounted(async () => {
  await trainingStore.fetchRecommendations();
  currentPage.value = 1;
});
</script>

<style scoped>
.page-layout {
  @apply flex;
}
.content-wrapper {
  @apply flex-1 px-[180px] py-12 max-w-[970px];
}
</style>
