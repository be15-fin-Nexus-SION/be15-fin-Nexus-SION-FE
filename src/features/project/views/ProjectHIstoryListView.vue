<script setup>
import { onMounted, ref } from "vue";
import { getMyProjectWorkRequests } from "@/api/project";
import ProjectHistoryList from "@/features/project/components/ProjectHistoryList.vue";

const projectHistories = ref([]);

onMounted(async () => {
  try {
    const res = await getMyProjectWorkRequests();
    if (res.data.success) {
      projectHistories.value = res.data.data;
    }
  } catch (err) {
    console.error("요청 목록 불러오기 실패:", err);
  }
});
</script>

<template>
  <div class="page-full">
    <div class="page-container">
      <h1 class="page-title">프로젝트 이력 등록 요청 목록</h1>
      <ProjectHistoryList :histories="projectHistories" />
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
