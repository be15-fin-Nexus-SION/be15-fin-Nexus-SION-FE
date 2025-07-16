<template>
  <div class="page-layout">
    <SidebarWrapper viewType="adminSetting" />

    <div class="content-wrapper">
      <h1 class="text-2xl font-bold mb-6">자격증 승인 관리</h1>

      <!-- 필터 탭 -->
      <div class="flex gap-2 mb-2">
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

      <!-- 테이블 -->
      <table class="w-[730px] border text-center">
        <thead class="bg-blue-100">
          <tr>
            <th class="py-2">이름</th>
            <th class="py-2">자격증명</th>
            <th class="py-2">취득일</th>
            <th class="py-2">파일</th>
            <th class="py-2">상태</th>
            <th class="py-2">관리</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="cert in pagedCertificates"
            :key="cert.userCertificateHistoryId"
            class="border-b"
          >
            <td class="py-3">{{ cert.employeeName }}</td>
            <td class="py-2">{{ cert.certificateName }}</td>
            <td class="py-2">{{ cert.issueDate }}</td>
            <td class="py-2 px-6">
              <a
                :href="cert.pdfFileUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:underline"
              >
                보기
              </a>
            </td>
            <td class="py-2 flex justify-center">
              <div class="flex w-fit">
                <ProjectHistoryStatusBadge :status="cert.certificateStatus" />
              </div>
            </td>
            <td class="py-2">
              <template v-if="cert.certificateStatus === 'PENDING'">
                <div class="flex gap-[5px] justify-center">
                  <button
                    class="px-2 py-0.5 bg-primary text-white rounded-md font-medium hover:bg-primary-hover"
                    @click="openApproveModal(cert.userCertificateHistoryId)"
                  >
                    승인
                  </button>
                  <button
                    class="px-2 py-0.5 bg-red-200 text-red-700 rounded-md font-medium hover:bg-red-300"
                    @click="openRejectModal(cert.userCertificateHistoryId)"
                  >
                    거부
                  </button>
                </div>
              </template>

              <template v-else-if="cert.certificateStatus === 'APPROVED'">
                <span class="text-gray-800 font-semibold">승인 완료</span>
              </template>

              <template v-else-if="cert.certificateStatus === 'REJECTED'">
                <span class="text-gray-800 font-semibold">거부 완료</span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 항목이 없을 때 메시지 -->
      <div
        v-if="pagedCertificates.length === 0"
        class="w-[730px] text-center py-6 text-gray-500"
      >
        자격증 승인 요청 내역이 없습니다
      </div>

      <!-- 페이지네이션 -->
      <div
        v-if="pagedCertificates.length > 0"
        class="mt-4 flex w-[730px] justify-center"
      >
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @change="changePage"
        />
      </div>
    </div>

    <!-- 승인 모달 -->
    <ModalConfirm
      v-if="isApproveModalOpen"
      :message="'자격증을 승인하시겠습니까?'"
      confirmText="승인"
      @confirm="confirmApprove"
      @close="isApproveModalOpen = false"
    />

    <!-- 거부 모달 -->
    <div
      v-if="isRejectModalOpen"
      class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
    >
      <div
        class="bg-white p-6 rounded-xl shadow-lg w-[320px] text-center relative"
      >
        <button
          @click="isRejectModalOpen = false"
          class="absolute top-2 right-3 text-lg text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <p class="text-base text-gray-800 mb-4">
          자격증 등록을 거부하시겠습니까?
        </p>
        <textarea
          v-model="rejectReason"
          placeholder="거부 사유를 입력해주세요"
          class="w-full border rounded p-2 text-sm h-20 resize-none"
        />
        <div class="flex justify-center mt-4 gap-2">
          <PrimaryButton @click="confirmReject" label="거부" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import ModalConfirm from "@/components/ConfirmModal.vue";
import Pagination from "@/components/Pagination.vue";
import ProjectHistoryStatusBadge from "@/components/badge/ProjectHistoryStatusBadge.vue";
import {
  fetchCertificateApprovals,
  approveCertificate,
  rejectCertificate,
} from "@/api/member.js";
import { showErrorToast, showSuccessToast } from "@/utills/toast.js";

const certificates = ref([]);
const selectedStatus = ref("ALL");
const isApproveModalOpen = ref(false);
const isRejectModalOpen = ref(false);
const selectedCertificateId = ref(null);
const rejectReason = ref("");

const currentPage = ref(1);
const itemsPerPage = 10;

const statuses = ["ALL", "PENDING", "APPROVED", "REJECTED"];
const statusLabels = {
  ALL: "전체",
  PENDING: "대기중",
  APPROVED: "승인됨",
  REJECTED: "거부됨",
};

const loadCertificates = async () => {
  try {
    const res = await fetchCertificateApprovals();
    certificates.value = res.data.data;
  } catch (e) {
    const errorMessage =
      e.response?.data?.message || "자격증 목록을 불러오지 못했습니다.";
    showErrorToast(errorMessage);
  }
};

const openApproveModal = (id) => {
  selectedCertificateId.value = id;
  isApproveModalOpen.value = true;
};

const openRejectModal = (id) => {
  selectedCertificateId.value = id;
  isRejectModalOpen.value = true;
  rejectReason.value = "";
};

const confirmApprove = async () => {
  try {
    await approveCertificate(selectedCertificateId.value);
    showSuccessToast("자격증 승인이 완료되었습니다.");
    isApproveModalOpen.value = false;
    await loadCertificates();
  } catch (e) {
    const errorMessage =
      e.response?.data?.message || "승인을 실패했습니다. 다시 시도하세요.";
    showErrorToast(errorMessage);
  }
};

const confirmReject = async () => {
  const reason = rejectReason.value.trim();
  if (!reason) {
    showErrorToast("거부 사유를 입력해주세요.");
    return;
  }

  try {
    await rejectCertificate(selectedCertificateId.value, reason);
    showSuccessToast("자격증 등록 거부가 완료되었습니다.");
    isRejectModalOpen.value = false;
    await loadCertificates();
  } catch (e) {
    const errorMessage =
      e.response?.data?.message || "거부를 실패했습니다. 다시 시도하세요.";
    showErrorToast(errorMessage);
  }
};

const filteredCertificates = computed(() => {
  if (selectedStatus.value === "ALL") return certificates.value;
  return certificates.value.filter(
    (c) => c.certificateStatus === selectedStatus.value,
  );
});

const pagedCertificates = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredCertificates.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() =>
  Math.ceil(filteredCertificates.value.length / itemsPerPage),
);

const changePage = (page) => {
  currentPage.value = page;
};

onMounted(loadCertificates);
</script>

<style scoped>
.page-layout {
  @apply relative flex;
}

.content-wrapper {
  @apply flex-1 px-[180px] py-12 max-w-[970px];
}
</style>
