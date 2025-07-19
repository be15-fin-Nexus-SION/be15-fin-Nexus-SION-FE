<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  getSquadDetail,
  postSquadComment,
  patchConfirmSquad,
  getSquadComments,
  deleteSquadComment,
  deleteSquadByCode,
} from "@/api/squad";

import SquadMemberList from "@/features/squad/components/SquadMemberList.vue";
import SquadInfo from "@/features/squad/components/SquadInfo.vue";
import SquadCostTable from "@/features/squad/components/SquadCostTable.vue";
import SquadCommentForm from "@/features/squad/components/SquadCommentForm.vue";
import ConfirmModal from "@/features/squad/components/ConfirmDeleteModal.vue";
import SquadCommentList from "@/features/squad/components/SquadCommentList.vue";
import { useAuthStore } from "@/stores/auth";
import { showErrorToast, showSuccessToast } from "@/utills/toast.js";

const props = defineProps({
  squadCode: String,
});

const squad = ref({ members: [], costDetails: [] });
const isLoaded = ref(false);
const showDropdown = ref(false);
const showConfirmModal = ref(false);
const showDeleteModal = ref(false);
const showSquadDeleteModal = ref(false);
const selectedCommentId = ref(null);
const commentList = ref([]);
const auth = useAuthStore();
const router = useRouter();
const squadCode = props.squadCode ?? useRoute().params.squadCode;

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const editSquad = () => {
  showDropdown.value = false;
  router.push(
    `/squads/create/${squad.value.projectCode}?squadCode=${squadCode}`,
  );
};

const deleteSquad = () => {
  showDropdown.value = false;
  showSquadDeleteModal.value = true;
};

const confirmSquadDelete = async () => {
  try {
    await deleteSquadByCode(squadCode);
    showSuccessToast("스쿼드가 성공적으로 삭제되었습니다.");
    showSquadDeleteModal.value = false;
    await router.push({ name: "squad-list" });
  } catch (e) {
    console.error("스쿼드 삭제 실패:", e);
    showErrorToast("스쿼드 삭제에 실패했습니다.");
  }
};

const openConfirmModal = () => {
  showConfirmModal.value = true;
};

const handleClose = () => {
  showConfirmModal.value = false;
};

const handleConfirm = async () => {
  try {
    await patchConfirmSquad(squadCode);
    showSuccessToast("스쿼드가 확정되었습니다.");
    showConfirmModal.value = false;
    const res = await getSquadDetail(squadCode);
    const data = res?.data?.data || res?.data;
    squad.value = {
      ...data,
      members: data.members || [],
      costDetails: data.costDetails || [],
    };
    await router.push({ name: "squad-list" });
  } catch (e) {
    showErrorToast("스쿼드 확정에 실패했습니다.");
  }
};

const formatCost = (cost) => {
  const n = Number(cost);
  return !n || isNaN(n) ? "-" : `₩${n.toLocaleString()}`;
};

const handleRequestDelete = (commentId) => {
  selectedCommentId.value = commentId;
  showDeleteModal.value = true;
};

const handleCancelDelete = () => {
  showDeleteModal.value = false;
};

const deleteComment = async () => {
  if (!selectedCommentId.value) {
    showErrorToast("삭제할 댓글이 유효하지 않습니다.");
    return;
  }
  try {
    await deleteSquadComment(squadCode, selectedCommentId.value);
    await loadComments();
    showDeleteModal.value = false;
  } catch (e) {
    showErrorToast("댓글 삭제에 실패했습니다.");
  }
};

const loadComments = async () => {
  try {
    const res = await getSquadComments(squadCode);
    const raw = res.data.data;
    commentList.value = Array.isArray(raw) ? raw : [];
  } catch (e) {
    showErrorToast("댓글 불러오기에 실패했습니다.");
    commentList.value = [];
  }
};

const submitComment = async (commentText) => {
  if (!commentText) return;
  const employeeId = auth.memberId;
  if (!employeeId) {
    showErrorToast("로그인이 필요합니다.");
    return;
  }
  try {
    await postSquadComment(squadCode, commentText);
    await loadComments();
  } catch (e) {
    showErrorToast("댓글 등록에 실패했습니다.");
  }
};

const dropdownRef = ref(null);

const handleClickOutside = (e) => {
  if (
    showDropdown.value &&
    dropdownRef.value &&
    !dropdownRef.value.contains(e.target)
  ) {
    showDropdown.value = false;
  }
};

onMounted(async () => {
  try {
    const res = await getSquadDetail(squadCode);
    const data = res?.data?.data || res?.data;
    if (!data) return;
    squad.value = {
      ...data,
      members: data.members || [],
      costDetails: data.costDetails || [],
    };
    isLoaded.value = true;
    await loadComments();
  } catch (e) {
    showErrorToast("스쿼드 상세 조회에 실패했습니다.");
  }

  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <transition name="slide-fade">
    <div
      v-if="isLoaded && squad.members"
      class="flex gap-6 p-6 w-[1050px] mx-auto items-start animate-slide"
    >
      <section class="w-[550px] p-2 flex flex-col space-y-4 justify-between">
        <!-- 배치 확정 버튼: AI 추천 or 배치된 경우 숨김 -->
        <div class="mt-2" v-if="!squad.isActive">
          <button
            class="w-full h-[52px] flex items-center justify-center gap-2 rounded-[8px] text-white font-semibold shadow-md hover:shadow-elevated transition-all duration-300 ease-in-out"
            :style="{
              background: 'linear-gradient(90deg, #42EA82 0%, #39F8CF 100%)',
            }"
            @click="openConfirmModal"
          >
            <img src="/Squad_confirm.png" alt="배치 확정" class="w-5 h-5" />
            배치 확정
          </button>
        </div>
        <div>
          <SquadMemberList
            :members="squad.members"
            :readonly="true"
            @update:members="(updated) => (squad.members = updated)"
          />
        </div>

        <!-- Confirm 배치 확정 모달 -->
        <ConfirmModal
          v-if="showConfirmModal"
          message="이 스쿼드를 프로젝트에 확정하시겠습니까?"
          confirmText="확정"
          :width="'350px'"
          @confirm="handleConfirm"
          @close="handleClose"
        />
      </section>

      <!-- 우측: Squad 정보 -->
      <section class="w-[55%] bg-white rounded-xl shadow p-6 relative">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-start gap-2">
            <h2 class="text-2xl font-semibold">{{ squad.title }}</h2>
            <span
              v-if="squad.origin === 'AI'"
              class="text-xs px-2 py-1 min-w-[55px] rounded-full text-white bg-gradient-to-r from-purple-500 to-sky-400 shadow-sm text-center mr-2"
            >
              AI 추천
            </span>
          </div>

          <!-- isActive가 false일 때만 ⋯ 버튼 영역 보임 -->
          <div class="relative" ref="dropdownRef" v-if="!squad.isActive">
            <button
              @click="toggleDropdown"
              class="text-xl leading-none w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded"
            >
              ⋯
            </button>
            <div
              v-if="showDropdown"
              class="absolute right-0 mt-0 w-28 bg-white border rounded shadow z-50"
            >
              <button
                class="w-full px-4 py-2 text-sm text-[#6574F6] hover:bg-gray-100 text-center"
                @click="editSquad"
              >
                스쿼드 수정
              </button>
              <button
                class="w-full px-4 py-2 text-sm text-[#FF0000] hover:bg-gray-100 text-center"
                @click="deleteSquad"
              >
                스쿼드 삭제
              </button>
            </div>
          </div>
        </div>

        <!-- SquadInfo -->
        <SquadInfo
          :description="
            squad.origin === 'AI'
              ? squad.recommendationReason
              : squad.description
          "
          :period="squad.estimatedDuration"
          :totalCost="formatCost(squad.totalCost)"
          :isAI="squad.origin === 'AI'"
        />

        <!-- 비용 -->
        <div class="my-6">
          <SquadCostTable
            :details="squad.members"
            :total="formatCost(squad.totalCost)"
          />
        </div>

        <!-- 댓글 등록 -->
        <SquadCommentForm @submit="submitComment" />

        <!-- 댓글 리스트 -->
        <SquadCommentList
          :comments="commentList"
          :currentUserId="auth.memberId?.toString()"
          @request-delete="handleRequestDelete"
        />

        <!-- 스쿼드 삭제 모달 -->
        <ConfirmModal
          v-if="showSquadDeleteModal"
          message="스쿼드를 삭제하시겠습니까?"
          confirmText="삭제"
          :width="'350px'"
          @confirm="confirmSquadDelete"
          @close="showSquadDeleteModal = false"
        />

        <!-- 댓글 삭제 모달 -->
        <ConfirmModal
          v-if="showDeleteModal"
          message="댓글을 삭제하시겠습니까?"
          confirmText="삭제"
          :width="'350px'"
          @confirm="deleteComment"
          @close="handleCancelDelete"
        />
      </section>
    </div>
  </transition>
</template>

<style scoped>
/* 슬라이드 인 애니메이션 */
.slide-fade-enter-active {
  animation: slideInFromLeft 0.5s ease-out forwards;
}
@keyframes slideInFromLeft {
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
