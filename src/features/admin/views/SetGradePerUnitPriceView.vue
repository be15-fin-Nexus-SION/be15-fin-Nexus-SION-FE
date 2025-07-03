<script setup>
import { ref, onMounted } from "vue";
import { showErrorToast, showSuccessToast } from "@/utills/toast.js";
import { getUnitPriceByGrade, setUnitPriceByGrade } from "@/api/member.js";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import UnitPricePerGradeList from "@/features/admin/components/UnitPricePerGradeList.vue";

const unitPricePerGrades = ref([]);

async function fetchGradeList() {
  try {
    const res = await getUnitPriceByGrade();
    unitPricePerGrades.value = res.data.data;

    if (unitPricePerGrades.value.length === 0) {
      unitPricePerGrades.value = ["S", "A", "B", "C", "D"].map((code) => ({
        gradeCode: code,
        ratio: "0.2",
        productivity: code === "D" ? 1 : null,
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
  // 1. 모든 값은 null이면 안 됨
  for (const grade of unitPricePerGrades.value) {
    if (
      grade.productivity === null ||
      grade.productivity === undefined ||
      grade.monthlyUnitPrice === null ||
      grade.monthlyUnitPrice === undefined
    ) {
      showErrorToast(`등급 ${grade.gradeCode}의 값이 비어있습니다.`);
      return false;
    }
  }

  // 2. 생산성 내림차순 (S, A, B, C, D 순서)
  const productivityList = unitPricePerGrades.value.map((g) =>
    Number(g.productivity),
  );
  for (let i = 0; i < productivityList.length - 1; i++) {
    if (productivityList[i] < productivityList[i + 1]) {
      showErrorToast("생산성은 S부터 내림차순이어야 합니다.");
      return false;
    }
  }

  // 3. 단가 내림차순
  const priceList = unitPricePerGrades.value.map((g) =>
    Number(g.monthlyUnitPrice),
  );
  for (let i = 0; i < priceList.length - 1; i++) {
    if (priceList[i] < priceList[i + 1]) {
      showErrorToast("단가는 S부터 내림차순이어야 합니다.");
      return false;
    }
  }

  return true;
}

onMounted(fetchGradeList);
</script>

<template>
  <div class="page-layout">
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
