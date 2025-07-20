<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import DropdownSelect from "@/components/DropdownSelect.vue";
import { fetchAllDomains } from "@/api/domain.js";
import { fetchAllClientCompanies } from "@/api/clientCompany.js";
import { uploadDocument } from "@/api/document";
import { showErrorToast } from "@/utills/toast";

const props = defineProps({
  isEdit: Boolean,
  initialData: Object,
});

const emit = defineEmits(["submit", "delete"]);

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
});

const allDomains = ref([]);
const allClients = ref([]);

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
  const [domainRes, clientRes] = await Promise.all([
    fetchAllDomains(),
    fetchAllClientCompanies(),
  ]);

  allDomains.value = domainRes.data.data.domains ?? [];
  allClients.value = (clientRes.data.clients ?? []).map((c) => ({
    label: c.companyName,
    value: c.code,
  }));
});

watch(
  () => props.initialData,
  (data) => {
    if (!data) return;

    form.projectName = data.title;
    form.domain = data.domainName;
    form.overview = data.description;
    form.clientCode = data.clientCode;
    form.budget =
      typeof data.budget === "string"
        ? parseInt(data.budget.replace(/[^0-9]/g, ""))
        : data.budget;
    form.fileUrl = data.requestSpecificationUrl;

    form.startDate = data.startDate;
    form.endDate = data.endDate || data.expectedEndDate;
  },
  { immediate: true },
);

function handleFileUpload(e) {
  const selectedFile = e.target.files[0];

  if (selectedFile && selectedFile.type !== "application/pdf") {
    showErrorToast("PDF 파일만 업로드할 수 있습니다");
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
  if (form.projectName.trim().length > 10)
    return scrollAndToast(
      "project-name",
      "프로젝트명은 10자 이하로 입력해주세요",
    );
  if (!form.overview.trim())
    return scrollAndToast("overview", "개요를 입력해주세요");
  if (!form.fileUrl)
    return scrollAndToast("file-upload", "요구사항 명세서를 업로드해주세요");
  if (budget.value === "" || isNaN(budget.value) || budget.value < 0) {
    return scrollAndToast("budget", "유효한 예산을 입력해주세요");
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
    };

    const data = {
      payload,
      file: form.file,
    };

    emit("submit", data);
  } catch (e) {
    showErrorToast("저장 중 오류가 발생했습니다.");
  }
}
</script>

<template>
  <form id="edit-form" @submit.prevent="submitForm">
    <div>
      <div class="grid grid-cols-2 gap-[10px]">
        <div class="flex flex-col gap-[6px] mb-6">
          <label class="text">프로젝트명</label>
          <input
            v-model="form.projectName"
            placeholder="프로젝트 명"
            class="input"
          />
        </div>
        <div class="flex flex-col gap-[6px] mb-6">
          <label class="text">도메인</label>
          <DropdownSelect
            v-model="form.domain"
            :options="allDomains"
            placeholder="도메인 선택"
          />
        </div>
      </div>

      <div class="flex flex-col gap-[6px] mb-6">
        <label class="text">개요</label>
        <textarea
          v-model="form.overview"
          class="input"
          rows="4"
          placeholder="개요 입력"
        />
      </div>

      <div class="grid grid-cols-3 gap-[10px]">
        <div class="flex flex-col gap-[6px] mb-6">
          <label class="text">시작일</label>
          <input v-model="form.startDate" type="date" class="input" />
        </div>
        <div class="flex flex-col gap-[6px] mb-6">
          <label class="text">종료일</label>
          <input v-model="form.endDate" type="date" class="input" />
        </div>
        <div class="flex flex-col gap-[6px] mb-6">
          <label class="text">예산 (만원)</label>
          <input
            v-model="budget"
            type="number"
            class="input"
            placeholder="예: 5000"
          />
        </div>
      </div>

      <div class="flex flex-col gap-[6px] mb-6">
        <label class="text">요구사항 명세서</label>
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
        </div>
        <div
          v-if="form.fileName || form.fileUrl"
          class="mt-2 text-sm text-gray-600"
        >
          <span>{{ form.fileName || form.fileUrl?.split("/").pop() }}</span>
          <button @click="removeFile" class="ml-2 text-red-500">✕</button>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400;
}

.text {
  @apply text-sm text-gray-600 block;
}
</style>
