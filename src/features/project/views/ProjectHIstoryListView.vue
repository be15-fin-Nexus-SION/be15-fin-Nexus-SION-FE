<script setup>
import { onMounted, ref } from "vue";
import { getMyProjectWorkRequests } from "@/api/project";
import ProjectHistoryList from "@/features/project/components/ProjectHistoryList.vue";
import Pagination from "@/components/Pagination.vue";
import { showErrorToast } from "@/utills/toast.js";

const projectHistories = ref({
  content: [],
  currentPage: 0,
  totalPages: 1,
});

const currentPage = ref(1);

async function fetchHistories(page = 1) {
  try {
    const res = await getMyProjectWorkRequests(page - 1, 10);
    if (res.data.success) {
      projectHistories.value = res.data.data;
      currentPage.value = res.data.data.currentPage + 1;
    }
  } catch (e) {
    const errorMessage = e.response?.data?.message || "목록 불러오기 실패";
    showErrorToast(errorMessage);
  }
}

onMounted(() => {
  fetchHistories();
});
</script>

<template>
  <div class="page-full">
    <div class="page-container">
      <h1 class="page-title">프로젝트 이력 등록 요청 목록</h1>

      <ProjectHistoryList :histories="projectHistories.content || []" />

      <Pagination
        :current-page="currentPage"
        :total-pages="projectHistories.totalPages"
        @change="fetchHistories"
      />
    </div>
  </div>
</template>

<style scoped>
.page-full {
  @apply w-full h-fit flex justify-center;
}

.page-container {
  @apply flex flex-col w-[782px] h-fit items-center px-[30px] py-[30px] gap-[30px];
}

.page-title {
  @apply w-full text-headlineLg flex px-[12px] justify-start;
}
</style>
