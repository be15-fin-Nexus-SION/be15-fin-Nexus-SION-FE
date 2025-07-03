<template>
  <div class="flex h-full">
    <!-- 사이드바 -->
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
    <main class="flex-1 p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold mb-1">{{ selectedProjectTitle }}</h2>
          <p class="text-sm text-gray-500"></p>
        </div>
        <SquadDropdown />
      </div>

      <!-- 💡 오류 메시지 표시 -->
      <p v-if="projectLoadError" class="text-red-500 mb-4 text-sm">
        프로젝트 정보가 아직 로드되지 않았습니다.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <SquadCard
          v-for="squad in squads"
          :key="squad.squadCode"
          :squad="squad"
        />
      </div>

      <SquadPagination :page="page" :totalPages="totalPages" :goTo="goToPage" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import SquadSidebar from "@/features/squad/components/SquadSidebar.vue";
import SquadCard from "@/features/squad/components/SquadCard.vue";
import SquadDropdown from "@/features/squad/components/SquadDropdown.vue";
import SquadPagination from "@/features/squad/components/SquadPagination.vue";
import ProjectListModal from "@/features/squad/components/ProjectListModal.vue";
import { getSquadList } from "@/api/squad";
import { getProjectList } from "@/api/project";

const showMoreModal = ref(false);
const selectedMoreType = ref(""); // 예: 'waiting', 'inprogress', 'complete'

const squads = ref([]);
const page = ref(1);
const size = 6;
const totalPages = ref(1);

const selectedProjectCode = ref("");
const selectedProjectTitle = ref("");

const projectGroups = ref({ waiting: [], inprogress: [], complete: [] });
const projectMap = ref({}); // title → { projectCode, title, status }

const projectLoadError = ref(false); // 💡 추가

const closeModal = () => {
  showMoreModal.value = false;
};

const selectProjectAndClose = (projectCode) => {
  selectProject(projectCode);
  showMoreModal.value = false;
};

const fetchProjects = async () => {
  const response = await getProjectList({ page: 0, size: 100 });
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
        complete.push(project.projectCode);
        break;
      default:
        console.warn("⚠️ 알 수 없는 status:", project.status);
    }
  }

  projectMap.value = map;

  projectGroups.value = {
    waiting,
    inprogress,
    complete,
  };

  if (content.length) {
    selectedProjectCode.value = content[0].projectCode;
    selectedProjectTitle.value = content[0].title;
    fetchSquads();
  }
};

const fetchSquads = async () => {
  if (!selectedProjectCode.value) return;

  const response = await getSquadList({
    projectCode: selectedProjectCode.value,
    page: page.value - 1,
    size,
  });

  const squadData = response.data?.data ?? response.data ?? {};
  squads.value = squadData.content ?? [];
  totalPages.value = Math.ceil((squadData.totalCount ?? 0) / size);
};

const goToPage = (p) => {
  if (p >= 1 && p <= totalPages.value) {
    page.value = p;
    fetchSquads();
  }
};

const selectProject = (projectCode) => {
  const project = projectMap.value[projectCode];
  if (project) {
    selectedProjectTitle.value = project.title;
    selectedProjectCode.value = project.projectCode;
    page.value = 1;
    fetchSquads();
  }
};

const openMoreModal = (type) => {
  const codes = projectGroups.value[type];
  const hasProject = codes && codes.length > 0;
  const hasMap = Object.keys(projectMap.value).length > 0;

  if (!hasProject || !hasMap) {
    projectLoadError.value = true; // 💡 상태 true 설정
    return;
  }

  projectLoadError.value = false; // 💡 상태 초기화
  selectedMoreType.value = type;
  showMoreModal.value = true;
};

onMounted(fetchProjects);
</script>
