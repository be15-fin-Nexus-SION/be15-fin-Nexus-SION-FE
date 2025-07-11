<template>
  <div
    class="relative min-h-screen flex justify-center items-start py-10 px-4 overflow-hidden"
  >
    <!-- 📦 목록 + 제목 (슬라이드로 왼쪽 이동) -->
    <div
      class="z-10 max-w-[450px] w-full space-y-4 transition-transform duration-500 ease-in-out"
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

      <!-- 페이지네이션 -->
      <div class="flex justify-center mt-4">
        <BasePagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @change="handlePageChange"
        />
      </div>
    </div>

    <!-- 📦 상세 패널 (오른쪽 슬라이드) -->
    <transition name="slide">
      <FreelancerDetailPanel
        v-if="selectedFreelancer"
        :freelancer="selectedFreelancer"
        @close="selectedFreelancer = null"
        @refresh="loadFreelancers"
        class="absolute top-10 right-10 w-[640px]"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import FreelancerCard from "@/features/freelancer/components/FreelancerCard.vue";
import FreelancerDetailPanel from "@/features/freelancer/components/FreelancerDetailPanel.vue";
import BasePagination from "@/components/Pagination.vue";
import { fetchFreelancerList, fetchFreelancerDetail } from "@/api/freelancer";
import { showErrorToast } from "@/utills/toast";

const freelancers = ref([]);
const selectedFreelancer = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
const size = 10;

onMounted(() => {
  loadFreelancers();
});

async function loadFreelancers() {
  try {
    const res = await fetchFreelancerList({ page: currentPage.value, size });
    const pageData = res.data.data;
    freelancers.value = pageData.content;
    totalPages.value = pageData.totalPages;
  } catch (e) {
    showErrorToast("프리랜서 목록 불러오기 실패");
  }
}

async function selectFreelancer(freelancer) {
  try {
    const res = await fetchFreelancerDetail(freelancer.freelancerId);
    selectedFreelancer.value = res.data.data;
  } catch (e) {
    showErrorToast("프리랜서 상세 조회 실패");
  }
}

function handlePageChange(page) {
  currentPage.value = page;
  loadFreelancers();
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
