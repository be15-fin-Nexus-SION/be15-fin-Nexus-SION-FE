<template>
  <div
    v-if="isLoaded && squad.members"
    class="flex gap-6 p-6 w-[1050px] mx-auto"
  >
    <!-- 좌측: 스쿼드 구성 -->
    <section
      class="w-[45%] bg-white rounded-xl shadow p-4 flex flex-col justify-between"
    >
      <div>
        <SquadMemberList
          :members="squad.members"
          @update:members="(updated) => (squad.members = updated)"
        />
      </div>

      <!-- 배치 확정 버튼 -->
      <div class="mt-6">
        <button
          class="w-full h-[52px] flex items-center justify-center gap-2 rounded-[8px] text-white font-semibold shadow-md"
          :style="{
            background: 'linear-gradient(90deg, #42EA82 0%, #39F8CF 100%)',
          }"
          @click="openConfirmModal"
        >
          <img src="/Squad_confirm.png" alt="배치 확정" class="w-5 h-5" />
          배치 확정
        </button>
      </div>

      <ConfirmModal
        v-if="showConfirmModal"
        message="이 스쿼드를 프로젝트에 확정하시겠습니까?"
        confirmText="확정"
        :width="'350px'"
        @confirm="handleConfirm"
        @close="handleClose"
      />
    </section>

    <!-- 우측: 상세 정보 -->
    <section class="w-[55%] bg-white rounded-xl shadow p-6 relative">
      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-2">
          <h2 class="text-2xl font-semibold">{{ squad.squadName }}</h2>
          <span
            v-if="originType === 'AI'"
            class="text-xs px-2 py-1 rounded-full text-white bg-gradient-to-r from-purple-500 to-sky-400 shadow-sm"
          >
            AI 추천
          </span>
        </div>

        <div class="relative">
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
              class="w-full text-left px-4 py-2 text-sm text-[#6574F6] hover:bg-gray-100 text-center"
              @click="editSquad"
            >
              스쿼드 수정
            </button>
            <button
              class="w-full text-left px-4 py-2 text-sm text-[#FF0000] hover:bg-gray-100 text-center"
              @click="deleteSquad"
            >
              스쿼드 삭제
            </button>
          </div>
        </div>
      </div>

      <SquadInfo
        :name="squad.squadName"
        :aiRecommended="squad.aiRecommended"
        :reason="squad.recommendationReason"
        :period="squad.estimatedPeriod"
      />

      <div class="my-6">
        <SquadCostTable
          :details="squad.costDetails"
          :total="formatCost(squad.estimatedCost)"
        />
      </div>

      <SquadCommentForm @submit="submitComment" />

      <SquadCommentList
        :comments="commentList"
        :currentUserId="auth.memberId?.toString()"
        @request-delete="handleRequestDelete"
      />

      <ConfirmModal
        v-if="showSquadDeleteModal"
        message="스쿼드를 삭제하시겠습니까?"
        confirmText="삭제"
        :width="'350px'"
        @confirm="confirmSquadDelete"
        @close="showSquadDeleteModal = false"
      />

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
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  getSquadDetail,
  postSquadComment,
  patchConfirmSquad,
  getSquadComments,
  deleteSquadComment,
  deleteSquadByCode,
} from "@/api/squad";

import { useToast } from "vue-toastification";
import SquadMemberList from "@/features/squad/components/SquadMemberList.vue";
import SquadInfo from "@/features/squad/components/SquadInfo.vue";
import SquadCostTable from "@/features/squad/components/SquadCostTable.vue";
import SquadCommentForm from "@/features/squad/components/SquadCommentForm.vue";
import ConfirmModal from "@/features/squad/components/ConfirmDeleteModal.vue";
import SquadCommentList from "@/features/squad/components/SquadCommentList.vue";
import { useAuthStore } from "@/stores/auth";

const squad = ref({ members: [], costDetails: [] });
const isLoaded = ref(false);
const showDropdown = ref(false);
const showConfirmModal = ref(false);
const showDeleteModal = ref(false);
const showSquadDeleteModal = ref(false);
const selectedCommentId = ref(null);
const commentList = ref([]);
const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const squadCode = route.params.squadCode;
const originType = computed(() => squad.value.originType);
const toast = useToast();

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const editSquad = () => {
  showDropdown.value = false;
  router.push(`/squads/${squadCode}/edit`);
};

const deleteSquad = () => {
  showDropdown.value = false;
  showSquadDeleteModal.value = true;
};

const confirmSquadDelete = async () => {
  try {
    await deleteSquadByCode(squadCode);
    toast.success("✅ 스쿼드가 성공적으로 삭제되었습니다.");
    showSquadDeleteModal.value = false;
    router.push({ name: "squad-list" });
  } catch (e) {
    console.error("스쿼드 삭제 실패:", e);
    toast.error("스쿼드 삭제에 실패했습니다.");
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
    toast.success("스쿼드가 확정되었습니다.");
    showConfirmModal.value = false;
    const res = await getSquadDetail(squadCode);
    const data = res?.data?.data || res?.data;
    squad.value = {
      ...data,
      members: data.members || [],
      costDetails: data.costDetails || [],
    };
    router.push({ name: "squad-list" });
  } catch (e) {
    console.error("스쿼드 확정 실패:", e);
    toast.error("스쿼드 확정에 실패했습니다.");
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
    toast.error("삭제할 댓글이 유효하지 않습니다.");
    return;
  }
  try {
    await deleteSquadComment(squadCode, selectedCommentId.value);
    await loadComments();
    showDeleteModal.value = false;
  } catch (e) {
    console.error("댓글 삭제 실패:", e);
  }
};

const loadComments = async () => {
  try {
    const res = await getSquadComments(squadCode);
    const raw = res.data;
    commentList.value = Array.isArray(raw) ? raw : [];
  } catch (e) {
    console.error("댓글 불러오기 실패:", e);
    commentList.value = [];
  }
};

const submitComment = async (commentText) => {
  if (!commentText) return;
  const employeeId = auth.memberId;
  if (!employeeId) {
    toast.error("로그인이 필요합니다.");
    return;
  }
  try {
    await postSquadComment(squadCode, employeeId, commentText);
    await loadComments();
  } catch (e) {
    console.error("댓글 등록 실패:", e);
    toast.error("댓글 등록에 실패했습니다.");
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
    console.error("스쿼드 상세 조회 실패:", e);
  }
});
</script>
