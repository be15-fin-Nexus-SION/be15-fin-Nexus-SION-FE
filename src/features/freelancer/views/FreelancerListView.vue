<template>
  <div
    class="relative min-h-screen flex justify-center items-start py-10 px-4 overflow-hidden"
  >
    <!-- 📦 목록 + 제목 (슬라이드로 왼쪽 이동) -->
    <div
      class="z-10 max-w-[480px] w-full space-y-4 transition-transform duration-500 ease-in-out"
      :class="{
        'translate-x-0': !selectedFreelancer,
        '-translate-x-80': selectedFreelancer,
      }"
    >
      <!-- 타이틀 -->
      <h1 class="text-2xl font-bold text-center mb-2">프리랜서 목록</h1>

      <!-- ✅ 헤더 라벨 -->
      <div
        class="grid grid-cols-[60px_40px_50px_190px] gap-6 px-6 text-xs text-gray-400 font-semibold"
      >
        <div class="text-left">사번</div>
        <div class="text-left">프로필</div>
        <div class="text-left">이름</div>
        <div class="text-left">이메일</div>
      </div>

      <!-- 카드 목록 -->
      <div class="space-y-2">
        <FreelancerCard
          v-for="freelancer in freelancers"
          :key="freelancer.id"
          :freelancer="freelancer"
          @click="selectFreelancer(freelancer)"
        />
      </div>
    </div>

    <!-- 📦 상세 패널 (오른쪽 슬라이드) -->
    <transition name="slide">
      <FreelancerDetailPanel
        v-if="selectedFreelancer"
        :freelancer="selectedFreelancer"
        @close="selectedFreelancer = null"
        class="absolute top-10 right-10 w-[640px]"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import FreelancerCard from "@/features/freelancer/components/FreelancerCard.vue";
import FreelancerDetailPanel from "@/features/freelancer/components/FreelancerDetailPanel.vue";

const freelancers = ref([
  {
    id: 1,
    name: "김깅깡",
    email: "ggigga_ng@hanhwa.com",
    profileUrl: "https://placehold.co/160x160",
    phone: "010-73829-2222",
    grade: "S",
    years: "5년차",
    code: "DEV1000",
    resumeLink: "#",
    isEmployee: false,
  },
  {
    id: 2,
    name: "홍길동",
    email: "hong@company.com",
    profileUrl: "https://placehold.co/160x160",
    phone: "010-1234-5678",
    grade: "A",
    years: "3년차",
    code: "DEV2000",
    resumeLink: "#",
    isEmployee: true,
  },
]);

const selectedFreelancer = ref(null);
function selectFreelancer(f) {
  selectedFreelancer.value = f;
}
</script>

<style scoped>
.slide-enter-from {
  transform: translateX(700px);
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.6s ease;
}
.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
}
.slide-leave-to {
  transform: translateX(700px);
}
</style>
