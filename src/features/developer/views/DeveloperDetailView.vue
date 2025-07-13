<template>
  <LoadingSpinner v-if="isLoading" />
  <div v-else class="max-w-5xl mx-auto py-10 px-4 space-y-8">
    <!-- 상단 버튼 -->
    <div class="flex items-center justify-end">
      <div class="space-x-2" v-if="!props.readonly">
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
      class="relative bg-white p-10 rounded-xl border-b border-gray-150 flex gap-20 items-start"
    >
      <div class="absolute top-6 right-6">
        <span
          :class="[
            'px-4 py-1 rounded-full text-sm font-semibold',
            developer.status === 'IN_PROJECT'
              ? 'bg-green-100 text-green-700'
              : developer.status === 'AVAILABLE'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-600',
          ]"
        >
          {{ statusLabel(developer.status) }}
        </span>
      </div>

      <div class="w-48 flex flex-col items-center">
        <img
          :src="
            developer.profileImageUrl ||
            `https://api.dicebear.com/9.x/notionists/svg?seed=${employeeId}`
          "
          alt="프로필 이미지"
          class="w-48 h-48 rounded-full object-cover border mb-4"
        />
        <div class="text-center">
          <div class="text-lg font-bold text-gray-900">
            {{ developer.name }}
          </div>
          <div class="text-sm font-semibold text-gray-500 mt-1">
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

    <!-- 점수 카드 영역 -->
    <section class="grid grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-xl border border-gray-150 text-start">
        <div class="text-sm text-gray-500 font-semibold mb-2">총 점수</div>
        <div class="text-3xl font-bold mb-1">
          {{ scoreSummary?.currentTotalScore ?? "-" }}
        </div>
        <div class="flex justify-start items-center gap-2">
          <div class="text-xs text-green-600">
            {{ totalDiffText }}
          </div>
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
          <div class="text-xs text-green-600">
            {{ techDiffText }}
          </div>
          <div v-if="totalDiffDate" class="text-[10px] text-gray-400 mt-0.5">
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
          <div class="text-xs text-green-600">
            {{ certificateDiffText }}
          </div>
          <div v-if="totalDiffDate" class="text-[10px] text-gray-400 mt-0.5">
            ({{ certificateDiffDate }} 대비)
          </div>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-2 gap-6">
      <!--      <div class="bg-white p-4 rounded-xl shadow">-->
      <!--        <div class="font-semibold mb-4">보유 자격증</div>-->
      <!--        <ul v-if="certifications.length > 0" class="space-y-2 text-sm text-gray-800">-->
      <!--          <li-->
      <!--              v-for="(cert, index) in certifications"-->
      <!--              :key="index"-->
      <!--              class="flex items-center gap-2"-->
      <!--          >-->
      <!--            <span class="text-primary font-medium">•</span>-->
      <!--            <span>{{ cert.name }}</span>-->
      <!--            <span class="text-gray-400 text-xs ml-auto">{{ cert.issuedDate }}</span>-->
      <!--          </li>-->
      <!--        </ul>-->
      <!--        <div v-else class="h-40 flex items-center justify-center">-->
      <!--          <p class="text-gray-400 text-sm">보유한 자격증이 없습니다.</p>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="bg-white p-4 rounded-xl border border-gray-150">
        <div class="font-semibold mb-4">보유 자격증</div>
        <div class="h-40 flex items-center justify-center">
          <p class="text-gray-400 text-sm">보유한 자격증이 없습니다.</p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-gray-150">
        <div class="font-semibold mb-4">주요 기술 스택</div>
        <RadarChart v-if="radarData" :data="radarData" />
      </div>
    </section>

    <section class="bg-white p-4 rounded-xl border border-gray-150">
      <div class="font-semibold mb-4">기술 스택별 점수</div>
      <BarChart v-if="barData" :data="barData" />
    </section>

    <!-- 삭제 확인 모달 -->
    <ConfirmModal
      v-if="showDeleteConfirm"
      message="정말 삭제하시겠습니까?"
      confirmText="확인"
      @confirm="deleteDeveloperHandler"
      @close="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import BarChart from "@/features/developer/components/BarChart.vue";
import RadarChart from "@/features/developer/components/RadarChart.vue";
import {
  fetchDeveloperDetail,
  fetchTechStacksByEmployeeId,
  fetchScoreSummary,
  deleteDeveloper,
} from "@/api/member";
import TechBadge from "@/components/badge/TechBadge.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { showErrorToast, showSuccessToast } from "@/utills/toast.js";

const isLoading = ref(true);

const props = defineProps({
  employeeId: String,
  readonly: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();
const router = useRouter();
const employeeId = props.employeeId || route.params.employeeId;

const developer = ref(null);
const techList = ref([]);
const barData = ref(null);
const radarData = ref(null);
const showDeleteConfirm = ref(false);
const scoreSummary = ref(null);

const formatDateTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${day} ${h}:${min}`;
};

const totalDiffText = computed(() => {
  if (!scoreSummary.value) return "-";
  const diff =
    scoreSummary.value.currentTotalScore -
    scoreSummary.value.previousTotalScore;
  return diff !== 0 ? `+${diff}` : "-";
});
const totalDiffDate = computed(() => {
  if (!scoreSummary.value) return "";
  return formatDateTime(scoreSummary.value.previousTotalScoreDate);
});

const techDiffText = computed(() => {
  if (!scoreSummary.value) return "-";
  const diff =
    scoreSummary.value.currentTechScore - scoreSummary.value.previousTechScore;
  return diff !== 0 ? `+${diff}` : "-";
});
const techDiffDate = computed(() => {
  if (!scoreSummary.value) return "";
  return formatDateTime(scoreSummary.value.previousTechScoreDate);
});

const certificateDiffText = computed(() => {
  if (!scoreSummary.value) return "-";
  const diff =
    scoreSummary.value.currentCertificateScore -
    scoreSummary.value.previousCertificateScore;
  return diff !== 0 ? `+${diff}` : "-";
});
const certificateDiffDate = computed(() => {
  if (!scoreSummary.value) return "";
  return formatDateTime(scoreSummary.value.previousCertificateScoreDate);
});

const statusLabel = (status) => {
  switch (status) {
    case "AVAILABLE":
      return "대기중";
    case "IN_PROJECT":
      return "투입중";
    case "UNAVAILABLE":
      return "비활성";
    default:
      return status;
  }
};

function goToEdit() {
  router.push({ name: "developer-edit", params: { employeeId } });
}

async function deleteDeveloperHandler() {
  try {
    await deleteDeveloper(employeeId);
    showSuccessToast("삭제가 완료되었습니다.");
    router.push({ name: "developer-list" });
  } catch (e) {
    showErrorToast("삭제에 실패했습니다.");
  } finally {
    showDeleteConfirm.value = false;
  }
}

onMounted(async () => {
  try {
    const { data: devRes } = await fetchDeveloperDetail(employeeId);
    developer.value = devRes.data;

    const { data: stackRes } = await fetchTechStacksByEmployeeId(employeeId);
    const stackData = stackRes.data;

    techList.value = stackData.map((s) => s.techStackName);
    barData.value = stackData;

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

    const { data: scoreRes } = await fetchScoreSummary(employeeId);
    scoreSummary.value = scoreRes.data;
    console.log("scoreSummary: ", scoreSummary.value);
  } catch (e) {
    console.warn("총 점수 정보 없음");
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
