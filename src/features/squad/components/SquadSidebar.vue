<template>
  <aside
    class="w-64 min-w-[300px] h-screen bg-white p-4 border-r overflow-y-auto"
  >
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
import { useRouter } from "vue-router"; //
import SquadSidebarSection from "./SquadSidebarSection.vue";
import ConfirmDeleteModal from "@/features/squad/components/ConfirmDeleteModal.vue";

const router = useRouter();

const props = defineProps({
  projectGroups: Object,
  selectedProjectCode: String,
  projectMap: Object,
});

const emit = defineEmits(["select", "more"]);

const onSelect = (code) => emit("select", code);
const onMore = (type) => emit("more", type);

const showProjectAddModal = ref(false);

const confirmAddProject = () => {
  showProjectAddModal.value = false;

  console.log("라우터 이동 시도...");
  router.push({ name: "project-register" });
};
</script>
