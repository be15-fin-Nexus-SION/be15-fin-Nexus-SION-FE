<template>
  <aside class="w-64 h-screen bg-white p-4 border-r overflow-y-auto">
    <!-- 진행 전 프로젝트 관리 -->
    <div class="mb-4">
      <SquadSidebarSection
        title="진행 전 프로젝트 관리"
        :items="projectGroups.waiting.slice(0, 3)"
        :active="selectedProjectCode"
        :projectMap="projectMap"
        @select="onSelect"
      />
      <button
        v-if="projectGroups.waiting.length > 3"
        class="text-blue-500 text-sm mt-1 ml-2"
        @click="onMore('waiting')"
      >
        + 더보기
      </button>
    </div>

    <!-- 진행중 프로젝트 관리 -->
    <div class="mb-4">
      <SquadSidebarSection
        title="진행중 프로젝트 관리"
        :items="projectGroups.inprogress.slice(0, 3)"
        :active="selectedProjectCode"
        :projectMap="projectMap"
        @select="onSelect"
      />
      <button
        v-if="projectGroups.inprogress.length > 3"
        class="text-blue-500 text-sm mt-1 ml-2"
        @click="onMore('inprogress')"
      >
        + 더보기
      </button>
    </div>

    <!-- 완료 프로젝트 관리 -->
    <div class="mb-4">
      <SquadSidebarSection
        title="완료 프로젝트 관리"
        :items="projectGroups.complete.slice(0, 3)"
        :active="selectedProjectCode"
        :projectMap="projectMap"
        @select="onSelect"
      />
      <button
        v-if="projectGroups.complete.length > 3"
        class="text-blue-500 text-sm mt-1 ml-2"
        @click="onMore('complete')"
      >
        + 더보기
      </button>
    </div>

    <!-- 프로젝트 추가 버튼 -->
    <button
      class="w-full mt-6 bg-primary hover:bg-primary-hover text-white py-2 rounded-sm"
      @click="showProjectAddModal = true"
    >
      + 프로젝트 추가
    </button>

    <!-- ✅ 공통 ConfirmDeleteModal로 대체 -->
    <ConfirmDeleteModal
      v-if="showProjectAddModal"
      :message="'새 프로젝트를 추가하시겠습니까?'"
      confirmText="확인"
      @close="showProjectAddModal = false"
      @confirm="confirmAddProject"
    />
  </aside>
</template>

<script setup>
import { ref, onMounted } from "vue";
import SquadSidebarSection from "./SquadSidebarSection.vue";
import ConfirmDeleteModal from "@/features/squad/components/ConfirmDeleteModal.vue";

const props = defineProps({
  projectGroups: Object,
  selectedProjectCode: String,
  projectMap: Object,
});

const emit = defineEmits(["select", "more"]);

const onSelect = (code) => emit("select", code);
const onMore = (type) => emit("more", type);

// 🔹 모달 상태
const showProjectAddModal = ref(false);

// 🔹 프로젝트 추가 시 실행할 함수
const confirmAddProject = () => {
  showProjectAddModal.value = false;
  console.log("✅ 프로젝트 추가 확인됨");
  // 👉 여기에 실제 프로젝트 추가 로직 or 이동 처리 작성
};

onMounted(() => {
  console.log("✅ props.projectGroups:", props.projectGroups);
  console.log("✅ 진행중 length:", props.projectGroups?.inprogress?.length);
  console.log("✅ projectGroups.waiting:", props.projectGroups?.waiting);
  console.log("✅ projectMap:", props.projectMap);
  console.log("✅ props.projectGroups:", props.projectGroups);
});
</script>
