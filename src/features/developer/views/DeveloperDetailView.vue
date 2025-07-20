<template>
  <LoadingSpinner v-if="isLoading" />
  <div v-else class="max-w-5xl mx-auto py-10 px-4 space-y-8">
    <!-- 상단 버튼 -->
    <div class="flex items-center justify-between">
      <div class="text-xl font-semibold">개발자 상세</div>
      <div class="space-x-2" v-if="isAdmin && props.userModal">
        <button
          class="px-4 py-2 rounded-md bg-primary text-white text-sm"
          @click="goToEdit"
        >
          수정
        </button>
        <button
          class="px-4 py-2 rounded-md bg-gray-200 text-sm"
          @click="showDeleteConfirm = true"
        >
          삭제
        </button>
      </div>
    </div>

    <!-- 개인 정보 카드 -->
    <section
      v-if="developer"
      class="relative bg-white p-10 rounded-xl shadow flex gap-20 items-start"
    >
      <div class="absolute top-6 right-6">
        <StatusBadge :status="developer.status" />
      </div>

      <div class="w-48 flex flex-col items-center">
        <img
          :src="
            developer.profileImageUrl ||
            `https://api.dicebear.com/9.x/notionists/svg?seed=${developer.employeeId}`
          "
          alt="프로필 이미지"
          class="w-48 h-48 rounded-full object-cover border mb-4"
        />
        <div class="text-center">
          <div class="text-lg font-bold text-gray-900">
            {{ developer.name }}
          </div>
          <div class="text-headlineLg text-gray-500 mt-1">
            {{ developer.grade || "-" }}
          </div>
        </div>
      </div>

      <div class="flex-1 space-y-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-2">사원 정보</h3>
        <div class="border-b pb-4">
          <dl class="grid grid-cols-4 gap-y-3 text-sm text-gray-800">
            <dt class="font-semibold text-gray-500">사번</dt>
            <dd class="col-span-3">{{ developer.employeeId }}</dd>

            <dt class="font-semibold text-gray-500">직급</dt>
            <dd class="col-span-3">{{ developer.position || "-" }}</dd>

            <dt class="font-semibold text-gray-500">부서</dt>
            <dd class="col-span-3">{{ developer.department || "-" }}</dd>

            <dt class="font-semibold text-gray-500">생년월일</dt>
            <dd class="col-span-3">{{ developer.birthday || "-" }}</dd>

            <dt class="font-semibold text-gray-500">이메일</dt>
            <dd class="col-span-3">{{ developer.email }}</dd>

            <dt class="font-semibold text-gray-500">근무 기간</dt>
            <dd class="col-span-3">{{ developer.joinedAt }} ~ 진행중</dd>

            <dt class="font-semibold text-gray-500">연락처</dt>
            <dd class="col-span-3">
              {{ developer.phoneNumber }} | {{ developer.email }}
            </dd>

            <dt class="font-semibold text-gray-500">년차</dt>
            <dd class="col-span-3">{{ developer.careerYears }}년차</dd>
          </dl>
        </div>

        <h3 class="text-sm font-semibold text-gray-700 mb-2">기술 스택</h3>
        <div>
          <div class="flex flex-wrap gap-1.5">
            <TechBadge v-for="tech in techList" :key="tech" :label="tech" />
          </div>
        </div>
      </div>
    </section>

    <!-- 점수 카드 -->
    <section class="grid grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-xl border border-gray-150 text-start">
        <div class="text-sm text-gray-500 font-semibold mb-2">총 점수</div>
        <div class="text-3xl font-bold mb-1">
          {{ scoreSummary?.currentTotalScore ?? "-" }}
        </div>
        <div class="flex justify-start items-center gap-2">
          <div class="text-xs text-green-600">{{ totalDiffText }}</div>
          <div v-if="totalDiffDate" class="text-[10px] text-gray-400 mt-0.5">
            ({{ totalDiffDate }} 대비)
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl border border-gray-150 text-start">
        <div class="text-sm text-gray-500 font-semibold mb-2">
          기술스택 점수
        </div>
        <div class="text-3xl font-bold mb-1">
          {{ scoreSummary?.currentTechScore ?? "-" }}
        </div>
        <div class="flex justify-start items-center gap-2">
          <div class="text-xs text-green-600">{{ techDiffText }}</div>
          <div v-if="techDiffDate" class="text-[10px] text-gray-400 mt-0.5">
            ({{ techDiffDate }} 대비)
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl border border-gray-150 text-start">
        <div class="text-sm text-gray-500 font-semibold mb-2">자격증 점수</div>
        <div class="text-3xl font-bold mb-1">
          {{ scoreSummary?.currentCertificateScore ?? "-" }}
        </div>
        <div class="flex justify-start items-center gap-2">
          <div class="text-xs text-green-600">{{ certificateDiffText }}</div>
          <div
            v-if="certificateDiffDate"
            class="text-[10px] text-gray-400 mt-0.5"
          >
            ({{ certificateDiffDate }} 대비)
          </div>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-2 gap-6">
      <div class="bg-white p-4 rounded-xl shadow">
        <div class="font-semibold mb-4">보유 자격증</div>

        <div
          v-if="certificateList.length === 0"
          class="h-40 flex items-center justify-center"
        >
          <p class="text-gray-400 text-sm">보유한 자격증이 없습니다.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="cert in certificateList"
            :key="cert.userCertificateHistoryId"
            class="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow transition"
          >
            <div class="text-sm font-bold text-gray-800 mb-2">
              {{ cert.certificateName }}
            </div>
            <dl class="text-xs text-gray-600 space-y-1">
              <div>
                <dt class="inline font-medium text-gray-500">발급기관:</dt>
                <dd class="inline ml-1">
                  {{ cert.issuingOrganization || "미입력" }}
                </dd>
              </div>
              <div>
                <dt class="inline font-medium text-gray-500">발급일자:</dt>
                <dd class="inline ml-1">{{ cert.issueDate }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl shadow">
        <div class="font-semibold mb-4">주요 기술 스택</div>
        <RadarChart v-if="radarData" :data="radarData" />
      </div>
    </section>

    <section class="bg-white p-4 rounded-xl shadow">
      <div class="font-semibold mb-4">기술 스택별 점수</div>
      <BarChart v-if="barData" :data="barData" />
    </section>

    <section class="bg-white p-4 rounded-xl shadow">
      <div class="font-semibold mb-4">성장 추이</div>
      <GrowthChart v-if="developer" :employeeId="developer.employeeId" />
    </section>
  </div>

  <ConfirmModal
    v-if="showDeleteConfirm"
    message="정말 삭제하시겠습니까?"
    confirmText="확인"
    @confirm="deleteDeveloperHandler"
    @close="showDeleteConfirm = false"
  />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import BarChart from "@/features/developer/components/BarChart.vue";
import RadarChart from "@/features/developer/components/RadarChart.vue";
import GrowthChart from "@/features/developer/components/GrowthChart.vue";
import TechBadge from "@/components/badge/TechBadge.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import {
  fetchDeveloperDetail,
  fetchTechStacksByEmployeeId,
  fetchScoreSummary,
  deleteDeveloper,
} from "@/api/member";
import { showErrorToast, showSuccessToast } from "@/utills/toast.js";
import StatusBadge from "@/components/badge/StatusBadge.vue";
import { fetchUserCertificates } from "@/api/certificate.js";

const props = defineProps({
  employeeId: {
    type: String,
    default: null,
  },
  userModal: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const isLoading = ref(true);
const route = useRoute();
const router = useRouter();
const employeeId = computed(() => props.employeeId || route.params.employeeId);
console.log(employeeId.value);
const showDeleteConfirm = ref(false);

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.memberRole === "ADMIN");

const developer = ref(null);
const techList = ref([]);
const barData = ref(null);
const radarData = ref(null);
const scoreSummary = ref(null);
const certificateList = ref([]);

const formatDateTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const totalDiffText = computed(() => {
  if (!scoreSummary.value) return "-";
  const diff =
    scoreSummary.value.currentTotalScore -
    scoreSummary.value.previousTotalScore;
  return diff !== 0 ? `+${diff}` : "-";
});
const totalDiffDate = computed(() =>
  scoreSummary.value
    ? formatDateTime(scoreSummary.value.previousTotalScoreDate)
    : "",
);
const techDiffText = computed(() => {
  if (!scoreSummary.value) return "-";
  const diff =
    scoreSummary.value.currentTechScore - scoreSummary.value.previousTechScore;
  return diff !== 0 ? `+${diff}` : "-";
});
const techDiffDate = computed(() =>
  scoreSummary.value
    ? formatDateTime(scoreSummary.value.previousTechScoreDate)
    : "",
);
const certificateDiffText = computed(() => {
  if (!scoreSummary.value) return "-";
  const diff =
    scoreSummary.value.currentCertificateScore -
    scoreSummary.value.previousCertificateScore;
  return diff !== 0 ? `+${diff}` : "-";
});
const certificateDiffDate = computed(() =>
  scoreSummary.value
    ? formatDateTime(scoreSummary.value.previousCertificateScoreDate)
    : "",
);

function goToEdit() {
  router.push({
    name: "developer-edit",
    params: { employeeId: employeeId.value },
  });
}

async function deleteDeveloperHandler() {
  try {
    await deleteDeveloper(employeeId.value);
    showSuccessToast("삭제가 완료되었습니다.");
    router.push({ name: "developer-list" });
  } catch (e) {
    showErrorToast("삭제에 실패했습니다.");
    console.error("삭제 오류:", e);
  } finally {
    showDeleteConfirm.value = false;
  }
}

onMounted(async () => {
  try {
    const { data: devRes } = await fetchDeveloperDetail(employeeId.value);
    developer.value = devRes.data;

    const { data: stackRes } = await fetchTechStacksByEmployeeId(
      employeeId.value,
    );
    const stackData = stackRes.data;
    techList.value = stackData.map((s) => s.techStackName);
    barData.value = stackData;

    const { data: certRes } = await fetchUserCertificates(employeeId.value);
    certificateList.value = certRes.data;

    const top7 = [...stackData].sort((a, b) => b.score - a.score).slice(0, 7);
    radarData.value = {
      labels: top7.map((s) => s.techStackName),
      datasets: [
        {
          label: "기술 점수",
          data: top7.map((s) => s.score),
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
        },
      ],
    };

    const { data: scoreRes } = await fetchScoreSummary(employeeId.value);
    scoreSummary.value = scoreRes.data;
  } catch (e) {
    console.error("개발자 상세 정보 불러오기 실패", e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
th,
td {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
</style>
