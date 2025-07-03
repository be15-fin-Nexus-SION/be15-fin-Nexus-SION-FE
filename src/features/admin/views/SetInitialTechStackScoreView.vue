<script setup>
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import InitialTechStackScoreList from "@/features/admin/components/InitialTechStackScoreList.vue";
import { onMounted, ref } from "vue";
import { showErrorToast, showSuccessToast } from "@/utills/toast.js";
import { getAllInitialScores, setInitialScores } from "@/api/admin.js";
import PrimaryButton from "@/components/button/PrimaryButton.vue";

const initialScoreList = ref([]);

async function fetchInitialScore() {
  try {
    const res = await getAllInitialScores();
    initialScoreList.value = res.data.data;
    console.log("초기목록조회", initialScoreList.value);
  } catch (e) {
    const errorMessage =
      e.response?.data?.message || "초기 기술스택 점수 목록 조회 실패";
    showErrorToast(errorMessage);
  }
}

async function handleUpdate(updatedItem) {
  const index = initialScoreList.value.findIndex(
    (i) => i.id === updatedItem.id,
  );
  if (index !== -1) {
    initialScoreList.value[index] = updatedItem;
  }
}

async function handleAdd(newItem) {
  initialScoreList.value.push(newItem);
}

async function handleDelete(deletedItem) {
  initialScoreList.value = initialScoreList.value.filter(
    (item) => item.id !== deletedItem.id,
  );
}

async function handleSet() {
  try {
    if (!validateInitialScores()) {
      return;
    }

    // id 필드 제외한 새 배열 생성
    const scoresWithoutId = initialScoreList.value.map(
      ({ id, edited, ...rest }) => rest,
    );

    await setInitialScores({ initialScores: scoresWithoutId });
    await fetchInitialScore();
    showSuccessToast("저장 성공");
  } catch (e) {
    const errorMessage =
      e.response?.data?.message || "초기 기술스택 점수 목록 조회 실패";
    showErrorToast(errorMessage);
  }
}

function validateInitialScores() {
  const scores = initialScoreList.value;

  if (scores.length === 0) {
    showErrorToast("입력된 항목이 없습니다.");
    return false;
  }

  // 1. 첫 번째 항목 minYears는 1이어야 함
  const first = scores[0];
  if (first.minYears !== 1) {
    showErrorToast(
      `첫 번째 항목의 최소 연차(minYears)는 1이어야 하며, 자동으로 수정됩니다.`,
    );
    first.minYears = 1;
    return false;
  }

  for (let i = 0; i < scores.length; i++) {
    const current = scores[i];
    const next = scores[i + 1];

    const { minYears, maxYears, score } = current;

    // 현재 항목의 min > max 체크
    if (maxYears !== null && minYears > maxYears) {
      showErrorToast(
        `최소 연차(${minYears})는 최대 연차(${maxYears})보다 작아야 합니다.`,
      );
      return false;
    }

    // 점수 오름차순 체크
    if (i > 0 && scores[i - 1].score >= score) {
      showErrorToast(
        `초기 점수는 오름차순이어야 합니다. ${scores[i - 1].score} 다음 (${score})`,
      );
      return false;
    }

    // 다음 항목이 있다면 연속성 체크
    if (next) {
      if (maxYears === null) {
        showErrorToast(`최대 연차(maxYears)는 null일 수 없습니다.`);
        return false;
      }

      if (next.minYears === null) {
        showErrorToast(`최소 연차(minYears)는 null일 수 없습니다.`);
        return false;
      }

      if (maxYears + 1 !== next.minYears) {
        showErrorToast(
          `${maxYears} 다음은 ${maxYears + 1} 이어야 하지만, 현재 ${next.minYears}이며, 자동으로 수정됩니다.`,
        );
        next.minYears = maxYears + 1;
        return false;
      }

      if (minYears >= next.minYears) {
        showErrorToast(`현재 min: ${minYears}, 다음 min: ${next.minYears}`);
        return false;
      }
    }

    // 마지막 항목이라면 maxYears는 null로 자동 변경
    if (i === scores.length - 1 && maxYears !== null) {
      showErrorToast(
        "마지막 항목의 maxYears는 null이어야 하며, 자동으로 수정됩니다.",
      );
      current.maxYears = null;
    }
  }

  return true;
}

onMounted(fetchInitialScore);
</script>

<template>
  <div class="page-layout">
    <SidebarWrapper viewType="adminSetting" />
    <div class="content-wrapper">
      <h1 class="text-headlineMd">초기 기술 스택 점수 설정</h1>

      <InitialTechStackScoreList
        :scores="initialScoreList"
        @add="handleAdd"
        @update="handleUpdate"
        @delete="handleDelete"
      />

      <div class="flex justify-end w-full">
        <PrimaryButton
          label="저장"
          text-color-class="text-white"
          :onClick="handleSet"
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
