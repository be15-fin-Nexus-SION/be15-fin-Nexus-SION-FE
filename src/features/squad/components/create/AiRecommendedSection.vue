<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getRecommendedCandidates } from "@/api/squad";
import SelectRoleModal from "@/features/squad/components/modal/SelectRoleModal.vue";
import { useSquadStore } from "@/stores/squadCreateStore.js";
import { useDeveloperModal } from "@/composable/useDeveloperModal.js";

const route = useRoute();
const projectId = route.params.projectId;
const squadStore = useSquadStore();

const recommendedCandidates = ref({});
const scrollContainer = ref(null);
const showLeft = ref(false);
const showRight = ref(true);

// 모달 상태 및 개발자 정보
const showModal = ref(false);
const selectedDeveloper = ref(null);

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
  selectedDeveloper.value = dev;
  showModal.value = true;
}

function handleSelectConfirmed(devWithRole) {
  squadStore.addMember(devWithRole);
  showModal.value = false;
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

const { openModal } = useDeveloperModal();
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
                <tr
                  v-for="dev in developers"
                  :key="dev.id"
                  @click="openModal(dev.id)"
                  class="transition-all duration-200 ease-in hover:bg-gray-50 hover:shadow-md cursor-pointer"
                >
                  <td>{{ dev.name }}</td>
                  <td class="font-bold">{{ dev.grade }}</td>
                  <td class="text-primary font-semibold">
                    {{ dev.avgTechScore }}
                    <span class="text-xs font-medium text-gray-400 ml-0.5"
                      >점</span
                    >
                  </td>
                  <td>
                    <span class="text-gray-800 font-medium">{{
                      dev.domainCount
                    }}</span>
                    <span class="text-xs text-gray-400 ml-0.5">번</span>
                  </td>
                  <td class="text-gray-700 font-semibold">
                    {{ dev.monthlyUnitPrice.toLocaleString() }}원
                  </td>
                  <td>
                    <button @click.stop="handleAdd(dev)" class="btn-add">
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

    <!-- 직무 선택 모달 -->
    <SelectRoleModal
      v-if="showModal"
      :developer="selectedDeveloper"
      :roles="Object.keys(recommendedCandidates)"
      @select="handleSelectConfirmed"
      @close="showModal = false"
    />
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
  @apply absolute top-[45%] z-10 bg-white shadow-md border border-gray-300 rounded-full px-3 py-2 text-xl text-center;
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
