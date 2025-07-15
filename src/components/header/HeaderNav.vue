<template>
  <div class="menu-container">
    <!-- 관리자 메뉴 -->
    <template v-if="isAdmin">
      <router-link
        to="/statistics/stack/member-count"
        class="menu-text menu-box"
        >통계</router-link
      >
      <router-link to="/developers" class="menu-text menu-box"
        >개발자</router-link
      >
      <router-link to="/projects" class="menu-text menu-box"
        >프로젝트</router-link
      >
      <router-link to="/squads" class="menu-text menu-box">스쿼드</router-link>
    </template>

    <!-- 개발자 메뉴 (INSIDER or OUTSIDER) -->
    <template v-else-if="isDeveloper">
      <router-link to="/projects" class="menu-text menu-box">
        프로젝트
      </router-link>
      <router-link to="/self-development/recommend" class="menu-text menu-box">
        자기계발
      </router-link>
      <router-link :to="`/developers/${memberId}`" class="menu-text menu-box">
        마이페이지
      </router-link>
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const memberId = authStore.memberId;
const isAdmin = computed(() => authStore.memberRole === "ADMIN");
const isDeveloper = computed(() =>
  ["INSIDER", "OUTSIDER"].includes(authStore.memberRole),
);
</script>

<style scoped>
.menu-container {
  @apply flex items-center gap-[39px];
}

.menu-text {
  @apply text-[18px] leading-[22px] font-semibold text-[#474747] flex items-center justify-center h-[63px];
  text-decoration: none;
}

.menu-text:hover {
  color: #6574f6;
}
</style>
