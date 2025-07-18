<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import TechStackSelectModal from "@/components/modal/TechStackSelectModal.vue";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import ProjectHistoryCard from "@/features/project/components/ProjectHistoryRegisterCard.vue";
import { getProjectInfo, addWorkHistories } from "@/api/project.js";
import { fetchAllTechStacks } from "@/api/techstack.js";
import { showErrorToast, showSuccessToast } from "@/utills/toast.js";
import ProjectModal from "@/features/project/components/ProjectModal.vue";
import AlreadyRequestedModal from "@/features/project/components/AlreadyRequestedModal.vue";

const router = useRouter();
const route = useRoute();
const projectWorkId = route.params.id;

const projectInfo = ref(null);
const projectCode = ref("");
const employeeIdentificationNumber = ref("");
const showAlreadyRequestedModal = ref(false);

const workHistoryItems = reactive([createNewWork()]);
const isModalOpen = ref(false);
const currentIndex = ref(null);
const selectedTechStacks = ref([]);
const allTechStacks = ref([]);
const errors = ref([{}]);
const showModal = ref(false);

function createNewWork() {
  return {
    id: Date.now() + Math.random(),
    functionName: "",
    functionDescription: "",
    functionType: "EI",
    det: 0,
    ftr: 0,
    techStackNames: [],
  };
}

onMounted(async () => {
  const authStore = useAuthStore();
  employeeIdentificationNumber.value = authStore.memberId;

  try {
    const res = await getProjectInfo(projectWorkId);
    projectInfo.value = res.data.data;
    projectCode.value = projectInfo.value.projectCode;

    if (projectInfo.value.approvalStatus !== "NOT_REQUESTED") {
      showAlreadyRequestedModal.value = true;
    }
  } catch (e) {
    const errorMessage = e.response?.data?.message || "프로젝트 정보 조회 실패";
    showErrorToast(errorMessage);
  }

  try {
    const res = await fetchAllTechStacks();
    allTechStacks.value = res.data.data.techStacks;
  } catch (e) {
    const errorMessage = e.response?.data?.message || "기술스택 불러오기 실패";
    showErrorToast(errorMessage);
  }
});

function addHistory() {
  workHistoryItems.push(createNewWork());
  errors.value.push({});
}

function removeHistory(index) {
  workHistoryItems.splice(index, 1);
  errors.value.splice(index, 1);
}

function openTechModal(index) {
  currentIndex.value = index;
  selectedTechStacks.value = [
    ...(workHistoryItems[index].techStackNames || []),
  ];
  isModalOpen.value = true;
}

function applyTechStacks(newStacks) {
  if (currentIndex.value !== null) {
    workHistoryItems[currentIndex.value].techStackNames = [...newStacks];
  }
  isModalOpen.value = false;
}

function validate(work) {
  const errs = {};
  if (!work.functionName) errs.functionName = "기능명은 필수입니다.";
  if (!work.functionDescription)
    errs.functionDescription = "기능 설명은 필수입니다.";
  if (!work.functionType) errs.functionType = "기능 유형은 필수입니다.";
  if (work.det == null || work.det < 0)
    errs.det = "연관 필드 개수는 0 이상이어야 합니다.";
  if (work.ftr == null || work.ftr < 0)
    errs.ftr = "연관 엔티티 개수는 0 이상이어야 합니다.";
  if (!work.techStackNames || work.techStackNames.length === 0) {
    errs.techStackNames = "기술 스택은 1개 이상 선택해야 합니다.";
  }
  return errs;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return dateStr.replaceAll("-", ".");
}

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

async function submit() {
  errors.value = workHistoryItems.map(validate);
  const hasError = errors.value.some((e) => Object.keys(e).length > 0);

  if (hasError) {
    const firstError = errors.value.find((e) => Object.keys(e).length > 0);
    const firstMessage = Object.values(firstError)[0];
    showErrorToast(firstMessage);
    return;
  }

  try {
    await addWorkHistories(projectWorkId, {
      workId: projectWorkId,
      histories: workHistoryItems.map((item) => ({
        functionName: item.functionName,
        functionDescription: item.functionDescription,
        functionType: item.functionType || "EI",
        det: String(item.det ?? "0"),
        ftr: String(item.ftr ?? "0"),
        techStackNames: item.techStackNames || [],
      })),
    });
    showSuccessToast("프로젝트 이력을 등록했습니다.");
    router.push(`/projects/history/${projectWorkId}`);
  } catch (e) {
    const errorMessage = e.response?.data?.message || "등록에 실패했습니다.";
    showErrorToast(errorMessage);
  }
}
</script>

<template>
  <div class="page-full">
    <div class="page-container">
      <h1 class="page-title">프로젝트 이력 등록</h1>

      <div class="project-info" v-if="projectInfo">
        <div class="project-status">
          <div class="project-name">{{ projectInfo.projectTitle }}</div>
          <span>|</span>
          <span class="project-dates">
            {{ formatDate(projectInfo.startDate) }} ~
            {{ formatDate(projectInfo.endDate) }}
          </span>
        </div>
        <span class="project-link" @click="openModal"
          >해당 프로젝트 자세히 보기</span
        >
      </div>

      <!-- 등록 버튼 -->
      <div class="submit-button-wrapper">
        <PrimaryButton label="등록 요청 보내기" @click="submit" />
      </div>

      <!-- 등록 카드 리스트 -->
      <div
        v-for="(item, index) in workHistoryItems"
        :key="item.id"
        class="card-wrapper"
      >
        <ProjectHistoryCard
          class="mx-auto"
          v-model="workHistoryItems[index]"
          :errorMessages="errors[index]"
          @remove="removeHistory(index)"
          @open-tech-modal="openTechModal(index)"
        />
      </div>

      <!-- 추가 버튼 -->
      <div class="add-button-wrapper">
        <button @click="addHistory" class="add-button">+</button>
      </div>

      <!-- 기술스택 선택 모달 -->
      <TechStackSelectModal
        v-if="isModalOpen"
        :all-tech-stacks="allTechStacks"
        :initial-selected="selectedTechStacks"
        @apply="applyTechStacks"
        @close="isModalOpen = false"
      />
    </div>
  </div>

  <!-- 프로젝트 상세 모달 -->
  <ProjectModal
    v-if="showModal"
    :projectCode="projectInfo?.projectCode"
    @close="closeModal"
  />

  <!-- 승인 요청 상태일 경우 안내 모달만 띄움 -->
  <AlreadyRequestedModal v-if="showAlreadyRequestedModal" />
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

.project-info {
  @apply w-full flex flex-col justify-start px-[12px] gap-[10px];
}

.project-status {
  @apply flex items-center gap-2 text-bodySm;
}

.project-name {
  @apply text-bodySm;
}

.project-dates {
  @apply text-bodySm;
}

.project-link {
  @apply text-bodySm text-primary hover:text-primary-hover hover:underline cursor-pointer w-fit;
}

.submit-button-wrapper {
  @apply w-full max-w-3xl flex justify-end mx-auto;
}

.card-wrapper {
  @apply w-full max-w-4xl mx-auto;
}

.add-button-wrapper {
  @apply flex justify-center;
}

.add-button {
  @apply w-14 h-14 flex items-center justify-center bg-primary text-white text-2xl rounded-full shadow-md;
}
</style>
