<script setup>
import { ref, onMounted, computed } from "vue";
import { useToast } from "vue-toastification";
import SquadSidebar from "@/features/squad/components/SquadSidebar.vue";
import SquadCard from "@/features/squad/components/SquadCard.vue";
import SquadDropdown from "@/features/squad/components/SquadDropdown.vue";
import ProjectListModal from "@/features/squad/components/ProjectListModal.vue";
import { getSquadList, deleteSquadByCode } from "@/api/squad";
import { fetchProjectList } from "@/api/project";
import BasePagination from "@/components/Pagination.vue";
import { useRoute } from "vue-router";
import SquadDetailView from "@/features/squad/views/SquadDetailView.vue";
import { useSquadStore } from "@/stores/squadCreateStore.js";

const totalCount = ref(0); // 총 스쿼드 수

const toast = useToast();

const showMoreModal = ref(false);
const selectedMoreType = ref("");

const squads = ref([]);
const page = ref(1);
const size = 9;
const totalPages = ref(1);

const route = useRoute();

const selectedProjectCode = ref();
const selectedProjectTitle = ref("");
const selectedProjectStatus = computed(() => {
  return (
    projectMap.value[selectedProjectCode.value]?.status?.toUpperCase() ?? ""
  );
});

const isEvaluating = computed(() => {
  return (
    projectMap.value[selectedProjectCode.value]?.analysisStatus !== "COMPLETE"
  );
});

const projectGroups = ref({ waiting: [], inprogress: [], complete: [] });
const projectMap = ref({}); // title → { projectCode, title, status }

const closeModal = () => {
  showMoreModal.value = false;
};

const selectProjectAndClose = (projectCode) => {
  selectProject(projectCode);
  showMoreModal.value = false;
};

const deleteSquad = async (squadCode) => {
  try {
    await deleteSquadByCode(squadCode);

    totalCount.value = Math.max(0, totalCount.value - 1);
    if (squads.value.length === 1 && page.value > 1) {
      page.value -= 1;
    }
    totalPages.value = Math.max(1, Math.ceil(totalCount.value / size));

    await fetchSquads();
    toast.success("스쿼드가 성공적으로 삭제되었습니다.");
  } catch (e) {
    console.error("스쿼드 삭제 실패:", e);
    toast.error("스쿼드 삭제에 실패했습니다.");
  }
};

const fetchProjects = async () => {
  const response = await fetchProjectList({ page: 0, size: 100 });
  const content = response.data.data?.content ?? [];

  const waiting = [],
    inprogress = [],
    complete = [];
  const map = {};

  for (const project of content) {
    map[project.projectCode] = project;

    switch (project.status?.toUpperCase()) {
      case "WAITING":
        waiting.push(project.projectCode);
        break;
      case "IN_PROGRESS":
        inprogress.push(project.projectCode);
        break;
      case "COMPLETE":
      case "INCOMPLETE":
      case "EVALUATION":
        complete.push(project.projectCode);
        break;
      default:
        console.warn("알 수 없는 status:", project.status);
    }
  }

  projectMap.value = map;

  projectGroups.value = {
    waiting,
    inprogress,
    complete,
  };

  const projectIdFromQuery = route.query.projectId;
  if (projectIdFromQuery && map[projectIdFromQuery]) {
    selectedProjectCode.value = projectIdFromQuery;
    selectedProjectTitle.value = map[projectIdFromQuery].title;
  } else if (content.length) {
    selectedProjectCode.value = content[0].projectCode;
    selectedProjectTitle.value = content[0].title;
  }

  await fetchSquads();
};

const fetchSquads = async () => {
  if (!selectedProjectCode.value) return;

  const response = await getSquadList({
    projectCode: selectedProjectCode.value,
    page: page.value - 1, // 0-indexed
    size,
  });

  const squadData = response.data?.data ?? {};
  squads.value = squadData.content ?? [];

  totalCount.value = squadData.totalElements ?? 0;
  totalPages.value = squadData.totalPages ?? 1;
  page.value = (squadData.currentPage ?? 0) + 1; // 현재 페이지 갱신
};

const goToPage = (p) => {
  if (p >= 1 && p <= totalPages.value) {
    page.value = p;
    fetchSquads();
  }
};

const squadStore = useSquadStore();
const selectProject = (projectCode) => {
  const project = projectMap.value[projectCode];
  if (project) {
    selectedProjectTitle.value = project.title;
    selectedProjectCode.value = project.projectCode;
    page.value = 1;
    fetchSquads();
    // 생성중이던 스쿼드 리셋하기
    if (project.status === "WAITING" || project.status === "EVALUATION") {
      squadStore.resetSquad();
    }
  }
};

const openMoreModal = (type) => {
  if (
    !projectGroups.value[type] ||
    projectGroups.value[type].length === 0 ||
    Object.keys(projectMap.value).length === 0
  ) {
    alert("프로젝트 정보가 아직 로드되지 않았습니다.");
    return;
  }

  selectedMoreType.value = type;
  showMoreModal.value = true;
};

onMounted(() => {
  selectedProjectCode.value = route.query.projectId;
  fetchProjects();
  squadStore.resetSquad();
});
</script>

<template>
  <div class="flex h-full">
    <SquadSidebar
      :projectGroups="projectGroups"
      :selectedProjectCode="selectedProjectCode"
      :projectMap="projectMap"
      @select="selectProject"
      @more="openMoreModal"
    />

    <ProjectListModal
      v-if="showMoreModal"
      :type="selectedMoreType"
      :projectCodes="projectGroups[selectedMoreType]"
      :projectMap="projectMap"
      @close="closeModal"
      @select="selectProjectAndClose"
    />

    <!-- 메인 컨텐츠 -->
    <div
      v-if="selectedProjectStatus === 'WAITING'"
      class="min-w-[900px] flex-1 flex flex-col p-6"
    >
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold mb-1">{{ selectedProjectTitle }}</h2>
          <p class="text-sm text-gray-500">스쿼드 구성 현황을 확인해보세요</p>
        </div>
        <SquadDropdown v-if="!isEvaluating" :projectId="selectedProjectCode" />
      </div>

      <main class="overflow-y-auto h-[550px] p-2">
        <div v-if="isEvaluating">
          <div class="text-center h-full text-gray-500 py-20 text-lg">
            평가중인 프로젝트입니다.
          </div>
        </div>
        <div v-if="!isEvaluating && totalCount === 0">
          <div class="text-center h-full text-gray-500 py-20 text-lg">
            스쿼드를 추가해주세요.
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <SquadCard
            v-for="squad in squads"
            :key="squad.squadCode"
            :squad="squad"
            :projectId="selectedProjectCode"
            @delete="deleteSquad"
          />
        </div>
      </main>

      <div class="mt-8 flex justify-center">
        <BasePagination
          :currentPage="page"
          :totalPages="totalPages"
          @change="goToPage"
        />
      </div>
    </div>
    <div v-else>
      <SquadDetailView
        v-if="squads.length > 0"
        :key="squads[0].squadCode"
        :squadCode="squads[0].squadCode"
      />
      <div v-else class="text-center text-gray-500 py-20 text-lg font-semibold">
        스쿼드 정보가 없습니다.
      </div>
    </div>
  </div>
</template>
