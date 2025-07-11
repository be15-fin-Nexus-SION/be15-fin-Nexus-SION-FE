<template>
  <div class="page-layout">
    <SidebarWrapper viewType="developerSelf" />

    <div class="content-wrapper">
      <h1 class="text-2xl font-bold mb-6">보유 자격증 조회</h1>

      <!-- ✅ 상태 필터 + 등록 버튼 -->
      <div class="w-[730px] flex justify-between mb-2">
        <div class="flex gap-2">
          <button
            v-for="s in statuses"
            :key="s"
            @click="
              () => {
                selectedStatus = s;
                currentPage = 1;
              }
            "
            :class="[
              'px-4 py-2 rounded-full font-medium text-sm transition-colors',
              selectedStatus === s
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
            ]"
          >
            {{ statusLabels[s] }}
          </button>
        </div>
        <button
          @click="isRegisterModalOpen = true"
          class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover text-sm font-medium"
        >
          자격증 등록
        </button>
      </div>

      <!-- 자격증 테이블 -->
      <table class="w-[730px] border text-center">
        <thead class="bg-blue-100">
          <tr>
            <th class="py-2">자격증명</th>
            <th class="py-2">발급기관</th>
            <th class="py-2">취득일자</th>
            <th class="py-2">상태</th>
            <th class="py-2">첨부파일</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="certificate in pagedCertificates"
            :key="certificate.userCertificateHistoryId"
            class="border-b"
          >
            <td class="py-3">{{ certificate.certificateName }}</td>
            <td class="py-3">{{ certificate.issuingOrganization }}</td>
            <td class="py-3">{{ formatDate(certificate.issueDate) }}</td>

            <td class="py-3">
              <span
                v-if="certificate.certificateStatus === 'REJECTED'"
                @click="showRejectReason(certificate.rejectedReason)"
                class="cursor-pointer px-2 py-1 rounded-full font-bold text-sm bg-red-100 text-red-700 hover:underline"
              >
                반려됨
              </span>
              <span
                v-else
                :class="[
                  'px-2 py-1 rounded-full font-bold text-sm',
                  certificate.certificateStatus === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700',
                ]"
              >
                {{ statusLabels[certificate.certificateStatus] }}
              </span>
            </td>

            <td class="py-2">
              <a
                :href="certificate.pdfFileUrl"
                target="_blank"
                class="text-blue-600 underline"
              >
                보기
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 페이지네이션 -->
      <div class="mt-4 flex justify-center">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @change="changePage"
        />
      </div>
    </div>

    <!-- 자격증 등록 모달 -->
    <div
      v-if="isRegisterModalOpen"
      class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
    >
      <div
        class="bg-white rounded-2xl shadow-xl w-[400px] px-6 py-8 text-left relative"
      >
        <button
          @click="isRegisterModalOpen = false"
          class="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>

        <h2 class="text-lg font-bold mb-6 text-center">자격증 등록</h2>

        <form @submit.prevent="submitCertificate" class="space-y-4">
          <input
            v-model="form.certificateName"
            type="text"
            placeholder="자격증명"
            class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-100"
          />
          <input
            v-model="form.issuingOrganization"
            type="text"
            placeholder="발급기관"
            class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-100"
          />
          <input
            v-model="form.issueDate"
            type="date"
            class="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-500 focus:outline-none focus:ring focus:ring-blue-100"
          />
          <div
            class="w-full border border-gray-300 rounded-md px-3 py-2 flex items-center gap-2 text-sm"
          >
            <label
              class="min-w-[90px] text-center bg-gray-100 px-3 py-1 rounded text-gray-800 cursor-pointer shrink-0"
            >
              파일 선택
              <input type="file" @change="handleFile" class="hidden" />
            </label>
            <span class="truncate">{{
              form.file?.name || "선택된 파일 없음"
            }}</span>
          </div>

          <div class="flex justify-center pt-4">
            <button
              type="submit"
              class="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 반려사유 모달 -->
    <div
      v-if="showRejectReasonModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
    >
      <div class="bg-white rounded-xl shadow-lg w-[350px] p-6 relative">
        <button
          @click="showRejectReasonModal = false"
          class="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>
        <h2 class="text-lg font-bold mb-4 text-center">반려 사유</h2>
        <p class="text-sm text-gray-700 whitespace-pre-line">
          {{ rejectReasonText }}
        </p>
        <div class="mt-6 text-center">
          <button
            @click="showRejectReasonModal = false"
            class="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary-hover"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import Pagination from "@/components/Pagination.vue";
import {
  fetchMyCertificates,
  developerregisterCertificate,
} from "@/api/member.js";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const allCertificates = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const isRegisterModalOpen = ref(false);

// ✅ 상태 필터 관련 상태
const selectedStatus = ref("ALL");
const statuses = ["ALL", "PENDING", "APPROVED", "REJECTED"];
const statusLabels = {
  ALL: "전체",
  PENDING: "대기중",
  APPROVED: "승인됨",
  REJECTED: "반려됨",
};

// 반려사유
const showRejectReasonModal = ref(false);
const rejectReasonText = ref("");

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR");
};

const loadCertificates = async () => {
  try {
    const res = await fetchMyCertificates();
    allCertificates.value = res.data.data;
  } catch (e) {
    console.error("보유 자격증 조회 실패", e);
  }
};

onMounted(loadCertificates);

// ✅ 필터링된 데이터
const filteredCertificates = computed(() => {
  if (selectedStatus.value === "ALL") return allCertificates.value;
  return allCertificates.value.filter(
    (cert) => cert.certificateStatus === selectedStatus.value,
  );
});

const totalPages = computed(() =>
  Math.ceil(filteredCertificates.value.length / itemsPerPage),
);

const pagedCertificates = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredCertificates.value.slice(start, start + itemsPerPage);
});

const changePage = (page) => {
  currentPage.value = page;
};

const form = ref({
  certificateName: "",
  issuingOrganization: "",
  issueDate: "",
  file: null,
});

const handleFile = (e) => {
  form.value.file = e.target.files[0];
};

const submitCertificate = async () => {
  try {
    const id = authStore.memberId;
    if (!id) {
      alert("사용자 정보가 확인되지 않아 등록할 수 없습니다.");
      return;
    }

    const formData = new FormData();
    formData.append("certificateName", form.value.certificateName);
    formData.append("issuingOrganization", form.value.issuingOrganization);
    formData.append("issueDate", form.value.issueDate);
    formData.append("pdfFileUrl", form.value.file);

    await developerregisterCertificate(id, formData);
    await loadCertificates();

    form.value = {
      certificateName: "",
      issuingOrganization: "",
      issueDate: "",
      file: null,
    };

    isRegisterModalOpen.value = false;
  } catch (e) {
    console.error("자격증 등록 실패", e);
    alert("자격증 등록 중 오류가 발생했습니다.");
  }
};

const showRejectReason = (reason) => {
  rejectReasonText.value = reason || "반려 사유가 없습니다.";
  showRejectReasonModal.value = true;
};
</script>

<style scoped>
.page-layout {
  @apply flex;
}
.content-wrapper {
  @apply flex-1 px-[180px] py-12 max-w-[970px];
}
</style>
