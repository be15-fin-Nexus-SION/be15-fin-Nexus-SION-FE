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

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <SquadCard
          v-for="squad in squads"
          :key="squad.squadCode"
          :squad="squad"
          @delete="deleteSquad"
        />
      </div>

      <SquadPagination :page="page" :totalPages="totalPages" :goTo="goToPage" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import SquadSidebar from "@/features/squad/components/SquadSidebar.vue";
import SquadCard from "@/features/squad/components/SquadCard.vue";
import SquadDropdown from "@/features/squad/components/SquadDropdown.vue";
import SquadPagination from "@/features/squad/components/SquadPagination.vue";
import ProjectListModal from "@/features/squad/components/ProjectListModal.vue";
import { getSquadList, deleteSquadByCode } from "@/api/squad";
import { fetchProjectList } from "@/api/project";

const totalCount = ref(0); // 총 스쿼드 수

const toast = useToast();

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
    toast.success("✅ 스쿼드가 성공적으로 삭제되었습니다.");
  } catch (e) {
    console.error("❌ 스쿼드 삭제 실패:", e);
    toast.error("스쿼드 삭제에 실패했습니다.");
  }
};

const fetchProjects = async () => {
  const response = await fetchProjectList({ page: 0, size: 100 });
  const content = response.data.data?.content ?? [];

  console.log("✅ 프로젝트 배열:", content);

  const waiting = [],
    inprogress = [],
    complete = [];
  const map = {};

  for (const project of content) {
    console.log("📦 프로젝트 코드:", project.projectCode);
    console.log("📦 상태 확인:", project.status);
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

  console.log("🟢 waiting:", waiting);
  console.log("🟡 inprogress:", inprogress);
  console.log("🔵 complete:", complete);
  console.log("📌 projectMap:", map);

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

  totalCount.value = squadData.totalCount ?? 0;
  totalPages.value = Math.max(1, Math.ceil(totalCount.value / size));
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
  console.log("🟢 모달 열기 요청 - type:", type);
  console.log("🟢 해당 코드들:", projectGroups.value[type]);
  console.log("🟢 projectMap 상태:", projectMap.value);

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

onMounted(fetchProjects);
</script>
