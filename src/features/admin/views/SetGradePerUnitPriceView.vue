<script setup>
import { ref } from "vue";
import { showErrorToast } from "@/utills/toast.js";
import { getUnitPriceByGrade } from "@/api/member.js";

const gradeList = ref([]);

async function fetchGradeList() {
  try {
    const res = await getUnitPriceByGrade();
    gradeList.value = res.data.data;
    console.log("초기목록조회", gradeList.value);
  } catch (e) {
    const errorMessage =
      e.response?.data?.message || "초기 등급별 점수 목록 조회 실패";
    showErrorToast(errorMessage);
  }
}
</script>

<template>
  <div>
    <h1>구간별 단가 설정</h1>
  </div>
</template>

<style scoped></style>
