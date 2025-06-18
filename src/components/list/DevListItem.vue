<template>
  <div class="developer-item">
    <div class="developer-content">
      <!-- 프로필 이미지 -->
      <img class="avatar" :src="profileImage" alt="profile" />

      <!-- 기본 정보 -->
      <span class="name">{{ name }}</span>
      <span class="code">{{ code }}</span>
      <span class="grade">{{ grade }}</span>
      <span class="career">{{ career }}</span>

      <!-- 기술 스택 -->
      <TechBadge :label="stack" />

      <!-- 입사일, 종료일 -->
      <span class="date">{{ startDate }}</span>
      <span class="date">{{ endDate }}</span>

      <!-- 상태 뱃지 -->
      <StatusBadge :status="status" />
    </div>
  </div>
</template>

<script setup>
import StatusBadge from "@/components/badge/StatusBadge.vue";
import TechBadge from "@/components/badge/TechBadge.vue";

const props = defineProps({
  profileImage: String,
  name: String,
  code: String,
  grade: String,
  career: String,
  stack: String,
  startDate: String,
  endDate: String,
  status: String,
});
</script>

<style scoped>
.developer-item {
  @apply w-[833px] h-[61px] flex justify-center items-center px-[17px] py-[9px] bg-white border border-[#EEEEEE] rounded;
}

.developer-content {
  @apply flex flex-row justify-center items-center gap-[46px] w-[799px] h-[43px];
}

.avatar {
  @apply w-[43px] h-[43px] rounded-full object-cover;
}

.name,
.code,
.grade,
.career,
.date {
  @apply text-[14px] leading-[17px] text-black font-normal;
}
</style>
