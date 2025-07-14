<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import DropdownSelect from "@/components/DropdownSelect.vue";
import TechBadge from "@/components/badge/TechBadge.vue";
import TechStackModal from "@/components/modal/TechStackSelectModal.vue";
import { fetchAllDomains } from "@/api/domain.js";
import { fetchAllClientCompanies } from "@/api/clientCompany.js";
import { fetchAllTechStacks } from "@/api/techstack.js";
import { fetchAllJobs } from "@/api/job.js";
import { uploadDocument } from "@/api/document.js";
import { analyzeProject, registerProject } from "@/api/project.js";
import { showErrorToast, showSuccessToast } from "@/utills/toast.js";
import { useRouter } from "vue-router";

const form = reactive({
  projectName: "",
  domain: "",
  overview: "",
  file: null,
  fileName: "",
  fileUrl: "",
  clientCode: "",
  startDate: "",
  endDate: "",
  budget: "",
  jobs: [{ id: 1, name: "", people: "", techStacks: [] }],
});
const router = useRouter();
const openedJobId = ref(null);
const allDomains = ref([]);
const allClients = ref([]);
const allTechStacks = ref([]);
const allJobs = ref([]);
const errorMessage = ref("");
const showErrorModal = ref(false);

const budget = computed({
  get() {
    return form.budget ? form.budget / 10000 : "";
  },
  set(value) {
    const num = Number(value);
    form.budget = isNaN(num) ? null : num * 10000;
  },
});

onMounted(async () => {
  const [domainRes, clientRes, techStackRes, jobRes] = await Promise.all([
    fetchAllDomains(),
    fetchAllClientCompanies(),
    fetchAllTechStacks(),
    fetchAllJobs(),
  ]);

  allDomains.value = domainRes.data.data.domains ?? [];
  const clientsRaw = clientRes.data.clients ?? [];
  allClients.value = clientsRaw.map((c) => ({
    label: c.companyName,
    value: c.code,
  }));
  allTechStacks.value = techStackRes.data.data.techStacks ?? [];
  allJobs.value = jobRes.data.data.jobs ?? [];
});

function handleFileUpload(e) {
  const selectedFile = e.target.files[0];

  if (selectedFile && selectedFile.type !== "application/pdf") {
    showErrorToast("PDF 파일만 업로드할 수 있습니다");
    form.file = null;
    form.fileName = "";
    form.fileUrl = "";
    e.target.value = "";
    return;
  }

  // ✅ 파일 크기 검사 (10MB 제한)
  if (selectedFile.size > 10 * 1024 * 1024) {
    showErrorToast("10MB 이하의 파일만 업로드할 수 있습니다");
    form.file = null;
    form.fileName = "";
    form.fileUrl = "";
    e.target.value = "";
    return;
  }

  form.file = selectedFile;
  form.fileName = selectedFile.name;
}

function removeFile() {
  form.file = null;
  form.fileName = "";
  form.fileUrl = "";
}

function removeJob(jobId) {
  if (form.jobs.length === 1) {
    showErrorToast("직무는 최소 1개 이상이어야 합니다.");
    return;
  }
  form.jobs = form.jobs.filter((j) => j.id !== jobId);
}

function addJob() {
  form.jobs.push({ id: Date.now(), name: "", people: "", techStacks: [] });
}

function openTechModal(job) {
  openedJobId.value = job.id;
}

function removeTech(job, techToRemove) {
  job.techStacks = job.techStacks.filter((t) => t !== techToRemove);
}

function scrollToTop() {
  document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
}

async function submitForm() {
  const scrollAndToast = (id, message) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    showErrorToast(message);
    scrollToTop();
  };

  if (!form.projectName.trim())
    return scrollAndToast("project-name", "프로젝트명을 입력해주세요");
  if (!form.domain) return scrollAndToast("domain", "도메인을 선택해주세요");
  if (!form.overview.trim())
    return scrollAndToast("overview", "개요를 입력해주세요");
  if (!form.clientCode)
    return scrollAndToast("client", "고객사를 선택해주세요");
  if (!form.file)
    return scrollAndToast("file-upload", "요구사항 명세서를 업로드해주세요");
  if (!form.startDate)
    return scrollAndToast("start-date", "시작일을 선택해주세요");
  if (!form.endDate) return scrollAndToast("end-date", "종료일을 선택해주세요");

  if (budget.value === "" || isNaN(budget.value) || budget.value < 0) {
    return scrollAndToast("budget", "유효한 예산을 입력해주세요");
  }

  for (const job of form.jobs) {
    if (!job.name)
      return scrollAndToast(`job-${job.id}-name`, "직무를 선택해주세요");
    if (!job.people || isNaN(job.people) || parseInt(job.people) <= 0) {
      return scrollAndToast(`job-${job.id}-people`, "예상 인원을 입력해주세요");
    }
    if (!job.techStacks.length)
      return scrollAndToast(`job-${job.id}-techs`, "기술 스택을 선택해주세요");
  }

  try {
    if (form.file) {
      const formData = new FormData();
      formData.append("file", form.file);
      formData.append("prefix", "projects");
      const res = await uploadDocument(formData);
      form.fileUrl = res.data.url;
    }

    const payload = {
      title: form.projectName,
      domainName: form.domain,
      description: form.overview,
      clientCode: form.clientCode,
      startDate: form.startDate,
      expectedEndDate: form.endDate,
      budget: form.budget !== "" ? parseInt(form.budget) : null,
      requestSpecificationUrl: form.fileUrl || null,
      numberOfMembers: form.jobs.reduce((sum, job) => {
        const people = parseInt(job.people);
        return sum + (isNaN(people) ? 0 : people);
      }, 0),
      jobs: form.jobs.map((j) => ({
        jobName: j.name,
        requiredNumber: parseInt(j.people),
        techStacks: j.techStacks.map((t, i) => ({
          techStackName: t,
          priority: i + 1,
        })),
      })),
    };

    const resp = await registerProject(payload);
    console.log(resp.data.data);
    await analyzeProject(resp.data.data.projectCode, form.file);
    showSuccessToast("프로젝트가 성공적으로 등록되었습니다.");
    setTimeout(() => {
      router.push({ path: "/projects", query: { refresh: "true" } });
    }, 1000);
  } catch (e) {
    showErrorToast("프로젝트 등록 중 오류가 발생했습니다");
    scrollToTop();
  }
}
</script>

<template>
  <div class="min-h-screen pt-6 pb-6 px-4">
    <div id="top"></div>
    <div
      v-if="showErrorModal"
      class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-700 px-4 py-2 rounded shadow z-50"
    >
      <div class="flex items-center justify-between gap-4">
        <span>{{ errorMessage }}</span>
        <button
          @click="
            () => {
              showErrorModal = false;
              scrollToTop();
            }
          "
          class="text-red-700 font-bold"
        >
          확인
        </button>
      </div>
    </div>

    <div
      class="max-w-4xl mx-auto px-8 py-4 bg-white rounded-xl shadow"
      style="box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.25)"
    >
      <h1 class="text-2xl font-bold mb-6">프로젝트 등록</h1>

      <!-- 프로젝트 명 & 도메인 -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-semibold mb-1">프로젝트 명</label>
          <input
            v-model="form.projectName"
            id="project-name"
            type="text"
            class="input"
            placeholder="프로젝트 명"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1">도메인</label>
          <DropdownSelect
            v-model="form.domain"
            :options="allDomains"
            id="domain"
            placeholder="도메인 선택"
          />
        </div>
      </div>

      <!-- 개요 -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">개요</label>
        <textarea
          v-model="form.overview"
          id="overview"
          class="input"
          rows="4"
          placeholder="프로젝트 개요 입력"
        />
      </div>

      <!-- 파일 + 고객사 -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1"
          >요구사항 명세서 & 고객사</label
        >
        <div class="flex gap-4">
          <div class="flex-1 relative flex items-center">
            <input
              type="file"
              class="hidden"
              id="file-upload"
              @change="handleFileUpload"
            />
            <label
              for="file-upload"
              class="input cursor-pointer flex items-center justify-between pr-10"
            >
              파일 업로드
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0l-4 4m4-4l4 4"
                />
              </svg>
            </label>
          </div>
          <div class="flex-1">
            <DropdownSelect
              v-model="form.clientCode"
              :options="allClients"
              optionKeyField="value"
              optionLabelField="label"
              id="client"
              placeholder="고객사 선택"
            />
          </div>
        </div>
        <div
          v-if="form.fileName"
          class="flex items-center gap-2 mt-2 ml-1 text-sm text-gray-600"
        >
          <span>{{ form.fileName }}</span>
          <button
            @click="removeFile"
            class="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>

      <!-- 날짜/예산 -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label class="block text-sm font-semibold mb-1">시작일</label>
          <input
            v-model="form.startDate"
            type="date"
            class="input"
            id="start-date"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1">종료일</label>
          <input
            v-model="form.endDate"
            type="date"
            class="input"
            id="end-date"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1">예산 (만원)</label>
          <input
            v-model="budget"
            type="number"
            class="input"
            placeholder="예: 5000"
          />
        </div>
      </div>

      <!-- 직무 및 기술 -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-semibold"
            >예상 인원 및 기술 스택</label
          >
          <span class="text-xs text-gray-500 pr-40"
            >기술스택 왼쪽부터 우선순위 1 2 3...</span
          >
        </div>

        <div v-for="job in form.jobs" :key="job.id" class="mb-6 relative">
          <!-- ❌ 삭제 버튼 -->
          <button
            class="absolute top-1/2 -translate-y-1/2 -right-2 text-gray-400 hover:text-red-500 text-xl z-10"
            @click="removeJob(job.id)"
            title="직무 삭제"
          >
            &times;
          </button>

          <div class="grid grid-cols-3 gap-2 items-center mb-2">
            <DropdownSelect
              v-model="job.name"
              :options="allJobs"
              :id="`job-${job.id}-name`"
              placeholder="직무 선택"
            />
            <input
              v-model="job.people"
              type="number"
              class="input"
              :id="`job-${job.id}-people`"
              placeholder="숫자입력"
            />
            <div class="w-28">
              <button
                class="w-full px-3 py-2 border rounded-lg text-sm text-blue-600 border-gray-300 hover:bg-blue-50"
                @click="openTechModal(job)"
              >
                + 기술 추가
              </button>
            </div>
          </div>

          <TechStackModal
            v-if="openedJobId === job.id"
            :all-tech-stacks="allTechStacks"
            :initial-selected="job.techStacks"
            @apply="(selected) => (job.techStacks = selected)"
            @close="openedJobId = null"
          />

          <div class="flex flex-wrap gap-2 mt-2" :id="`job-${job.id}-techs`">
            <TechBadge
              v-for="tech in job.techStacks"
              :key="tech"
              :label="tech"
              :showClose="true"
              @remove="() => removeTech(job, tech)"
            />
          </div>
        </div>

        <button class="text-sm text-blue-600" @click="addJob">
          + 직무추가
        </button>
      </div>

      <!-- 제출 버튼 -->
      <button
        class="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg font-semibold"
        @click="submitForm"
      >
        프로젝트 등록
      </button>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400;
}
</style>
