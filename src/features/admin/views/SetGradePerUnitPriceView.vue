<script setup>
import { ref, onMounted } from "vue";
import { showErrorToast, showSuccessToast } from "@/utills/toast.js";
import { getUnitPriceByGrade, setUnitPriceByGrade } from "@/api/member.js";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import UnitPricePerGradeList from "@/features/admin/components/UnitPricePerGradeList.vue";
import ExistSquadModal from "@/features/squad/components/ExistSquadModal.vue";

// ✅ [1] 상수 선언
const GRADE_CODES = Object.freeze(["S", "A", "B", "C", "D"]);
const DEFAULT_RATIO = "0.2";
const FIXED_PRODUCTIVITY_GRADE = "D";
const FIXED_PRODUCTIVITY_VALUE = 1;

const unitPricePerGrades = ref([]);

async function fetchGradeList() {
  try {
    const res = await getUnitPriceByGrade();
    unitPricePerGrades.value = res.data.data;

    if (unitPricePerGrades.value.length === 0) {
      unitPricePerGrades.value = GRADE_CODES.map((code) => ({
        gradeCode: code,
        ratio: DEFAULT_RATIO,
        productivity:
          code === FIXED_PRODUCTIVITY_GRADE ? FIXED_PRODUCTIVITY_VALUE : null,
        monthlyUnitPrice: null,
      }));
    }
  } catch (e) {
    showErrorToast(e.response?.data?.message || "등급별 단가 조회 실패");
  }
}

function handleUpdate(updatedItem) {
  const idx = unitPricePerGrades.value.findIndex(
    (i) => i.gradeCode === updatedItem.gradeCode,
  );
  if (idx !== -1) {
    unitPricePerGrades.value[idx] = updatedItem;
  }
}

async function handleSave() {
  try {
    if (!validate()) return;

    const payload = unitPricePerGrades.value.map(
      ({ edited, ratio, ...rest }) => rest,
    );

    await setUnitPriceByGrade({ grades: payload });
    await fetchGradeList();
    showSuccessToast("저장 성공");
  } catch (e) {
    showErrorToast(e.response?.data?.message || "저장 실패");
  }
}

function validate() {
  const grades = unitPricePerGrades.value;

  // 1. 모든 값이 유효한 숫자인지, 비어있지 않은지 확인
  for (const grade of grades) {
    if (
      grade.productivity === null ||
      String(grade.productivity).trim() === "" ||
      isNaN(Number(grade.productivity))
    ) {
      showErrorToast(
        `등급 ${grade.gradeCode}의 생산성 값이 유효하지 않습니다.`,
      );
      return false;
    }
    if (
      grade.monthlyUnitPrice === null ||
      String(grade.monthlyUnitPrice).trim() === "" ||
      isNaN(Number(grade.monthlyUnitPrice))
    ) {
      showErrorToast(`등급 ${grade.gradeCode}의 단가 값이 유효하지 않습니다.`);
      return false;
    }
  }

  // 2. 생산성 내림차순 (S, A, B, C, D 순서)
  const productivityList = grades.map((g) => Number(g.productivity));
  for (let i = 0; i < productivityList.length - 1; i++) {
    if (productivityList[i] < productivityList[i + 1]) {
      showErrorToast("생산성은 S부터 내림차순이어야 합니다.");
      return false;
    }
  }

  // 3. 단가 내림차순
  const priceList = grades.map((g) => Number(g.monthlyUnitPrice));
  for (let i = 0; i < priceList.length - 1; i++) {
    if (priceList[i] < priceList[i + 1]) {
      showErrorToast("단가는 S부터 내림차순이어야 합니다.");
      return false;
    }
  }

  return true;
}

onMounted(fetchGradeList);

// todo :  옮기기 !!
const showSquadModal = ref(true);

const handleSquadSelect = (squadCode) => {
  // ✅ todo : 여기에서 페이지 이동, 해당 스쿼드 코드 포함
};
</script>

<template>
  <div class="page-layout">
    <!-- todo :  옮기기 !! -->
    <ExistSquadModal
      v-show="showSquadModal"
      :is-modal-open="showSquadModal"
      @close="showSquadModal = false"
      @select="handleSquadSelect"
      project-code="ha_1_4"
      project-title="뭐시기타이틀"
    />
    <SidebarWrapper viewType="adminSetting" />
    <div class="content-wrapper">
      <h1 class="text-headlineMd">구간별 단가 설정</h1>

      <UnitPricePerGradeList
        :grades="unitPricePerGrades"
        @update="handleUpdate"
      />

      <div class="flex justify-end w-full">
        <PrimaryButton
          label="저장"
          text-color-class="text-white"
          :onClick="handleSave"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-layout {
  @apply relative flex;
}

.content-wrapper {
  @apply flex-1 px-10 py-20 space-y-12;
}
</style>
