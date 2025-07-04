<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getRecommendedCandidates } from "@/api/squad";

const route = useRoute();
const projectId = route.params.projectId;

const recommendedCandidates = ref({});
const scrollContainer = ref(null);
const showLeft = ref(false);
const showRight = ref(true);

onMounted(async () => {
  try {
    const res = await getRecommendedCandidates(projectId);
    recommendedCandidates.value = res.data?.candidates || {};
  } catch (error) {
    console.error("AI 추천 후보 조회 실패:", error);
  }

  updateScrollButtons();
});

function handleAdd(dev) {
  console.log("등록할 개발자:", dev);
}

function scrollByAmount(amount) {
  scrollContainer.value.scrollBy({ left: amount, behavior: "smooth" });
  setTimeout(updateScrollButtons, 300); // 버튼 상태 갱신
}

function updateScrollButtons() {
  const el = scrollContainer.value;
  showLeft.value = el.scrollLeft > 10;
  showRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 10;
}
</script>

<template>
  <div class="ai-recommended-section mx-auto">
    <!-- 스크롤 버튼 -->
    <button
      v-if="showLeft"
      class="scroll-arrow left"
      @click="scrollByAmount(-400)"
    >
      ◀
    </button>

    <button
      v-if="showRight"
      class="scroll-arrow right"
      @click="scrollByAmount(400)"
    >
      ▶
    </button>

    <!-- 스크롤 컨테이너 -->
    <div
      ref="scrollContainer"
      class="roles-scroll-container"
      @scroll="updateScrollButtons"
    >
      <div class="roles-inner">
        <div
          v-for="(developers, role) in recommendedCandidates"
          :key="role"
          class="role-card"
        >
          <h3 class="role-title">{{ role }}</h3>
          <div class="dev-table-wrapper">
            <table class="dev-table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>등급</th>
                  <th>기술 점수</th>
                  <th>도메인 경험</th>
                  <th>월 단가</th>
                  <th>추가</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="dev in developers" :key="dev.id">
                  <td>{{ dev.name }}</td>
                  <td>{{ dev.grade }}</td>
                  <td>{{ dev.avgTechScore }}</td>
                  <td>{{ dev.domainCount }}</td>
                  <td>{{ dev.monthlyUnitPrice.toLocaleString() }}원</td>
                  <td>
                    <button @click="handleAdd(dev)" class="btn-add">
                      추가
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-recommended-section {
  @apply w-[650px] relative;
}

.roles-scroll-container {
  @apply overflow-x-auto;
  scroll-behavior: smooth;
}

.roles-inner {
  @apply flex gap-4 w-max;
}

.role-card {
  @apply bg-white border border-gray-200 rounded shadow-sm p-4;
  min-width: 380px;
  flex-shrink: 0;
}

.role-title {
  @apply text-lg font-semibold mb-3;
}

.dev-table-wrapper {
  @apply overflow-x-auto;
}

.dev-table {
  @apply text-sm border-collapse w-max text-center;
}

.dev-table thead th {
  @apply bg-gray-100 text-gray-800 py-2 px-3 border-b border-gray-300 whitespace-nowrap;
}

.dev-table tbody td {
  @apply py-3 px-3 border-b border-gray-100 whitespace-nowrap;
}

.scroll-arrow {
  @apply absolute top-[45%] z-10 bg-white shadow-md border border-gray-300 rounded-full px-3 py-1 text-xl;
  transform: translateY(-50%);
  transition: opacity 0.3s ease;
}

.scroll-arrow.left {
  left: -20px;
}

.scroll-arrow.right {
  right: -20px;
}

.btn-add {
  @apply px-5 py-2 bg-white text-primary border border-primary shadow-sm rounded text-sm font-bold hover:bg-gray-50 transition;
}
</style>
