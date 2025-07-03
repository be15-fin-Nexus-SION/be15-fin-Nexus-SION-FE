<template>
  <div class="min-h-screen flex flex-col items-center py-10 space-y-8">
    <h1 class="text-2xl font-bold text-center">개발자 등록</h1>

    <!-- 등록 버튼: 카드 리스트 위쪽에 위치 -->
    <div class="w-full max-w-3xl flex justify-end mx-auto">
      <PrimaryButton label="등록" @click="submit" />
    </div>

    <!-- 개발자 카드 목록 -->
    <div
      v-for="(dev, index) in developers"
      :key="dev.id"
      class="w-full max-w-4xl mx-auto"
    >
      <DeveloperFormCard
        class="mx-auto"
        v-model="developers[index]"
        :errorMessages="errors[index]"
        @remove="removeDeveloper(index)"
        @open-tech-modal="openTechModal(index)"
      />
    </div>

    <!-- + 버튼 -->
    <div class="flex justify-center">
      <button
        @click="addDeveloper"
        class="w-14 h-14 flex items-center justify-center bg-primary text-white text-2xl rounded-full shadow-md"
      >
        +
      </button>
    </div>

    <!-- 기술스택 선택 모달 -->
    <TechStackSelectModal
      v-if="isModalOpen"
      :all-tech-stacks="allTechStacks"
      :initial-selected="selectedTechStacks"
      @apply="applyTechStacks"
      @close="isModalOpen = false"
    />

    <!-- 등록 확인 모달 -->
    <ConfirmModal
      v-if="showConfirm"
      message="등록하시겠습니까?"
      confirmText="등록"
      @confirm="submit"
      @close="showConfirm = false"
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import DeveloperFormCard from "../components/DeveloperFormCard.vue";
import TechStackSelectModal from "@/components/modal/TechStackSelectModal.vue";
import { registerDevelopers } from "@/api/member.js";
import { fetchAllTechStacks } from "@/api/techstack.js";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";

const router = useRouter();
const developers = reactive([createNewDeveloper()]);
const isModalOpen = ref(false);
const showConfirm = ref(false);
const currentDevIndex = ref(null);
const selectedTechStacks = ref([]);
const allTechStacks = ref([]);
const errors = ref([{}]);

function createNewDeveloper() {
  return {
    id: Date.now() + Math.random(),
    employeeIdentificationNumber: "",
    employeeName: "",
    phoneNumber: "",
    email: "",
    birthday: "",
    joinedAt: "",
    careerYears: "",
    profileImageUrl: null,
    positionName: "",
    departmentName: "",
    salary: "",
    techStackNames: [],
  };
}

onMounted(async () => {
  try {
    const response = await fetchAllTechStacks();
    allTechStacks.value = response.data.data.techStacks;
  } catch (e) {
    console.error("기술 스택 목록 조회 실패", e);
  }
});

function addDeveloper() {
  developers.push(createNewDeveloper());
  errors.value.push({});
}

function removeDeveloper(index) {
  developers.splice(index, 1);
  errors.value.splice(index, 1);
}

function openTechModal(index) {
  currentDevIndex.value = index;
  selectedTechStacks.value = [...developers[index].techStackNames];
  isModalOpen.value = true;
}

function applyTechStacks(newStacks) {
  if (currentDevIndex.value !== null) {
    developers[currentDevIndex.value].techStackNames = [...newStacks];
  }
  isModalOpen.value = false;
}

function validate(dev) {
  const errs = {};
  if (!dev.employeeName) errs.employeeName = "이름은 필수 입력 사항입니다.";
  if (!dev.employeeIdentificationNumber)
    errs.employeeIdentificationNumber = "사번은 필수 입력 사항입니다.";
  if (!dev.phoneNumber) errs.phoneNumber = "전화번호는 필수 입력 사항입니다.";
  else if (!/^010\d{8}$/.test(dev.phoneNumber))
    errs.phoneNumber = "전화번호 형식이 올바르지 않습니다.";
  if (!dev.email) errs.email = "이메일은 필수 입력 사항입니다.";
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(dev.email))
    errs.email = "이메일 형식이 올바르지 않습니다.";
  if (!dev.birthday) errs.birthday = "생년월일은 필수 입력 사항입니다.";
  if (!dev.joinedAt) errs.joinedAt = "입사일은 필수 입력 사항입니다.";
  if (dev.careerYears === "") errs.careerYears = "년차는 필수 입력 사항입니다.";
  return errs;
}

async function submit() {
  errors.value = developers.map(validate);
  const hasError = errors.value.some((e) => Object.keys(e).length > 0);
  showConfirm.value = false;
  if (hasError) return;
  try {
    const payload = developers.map((dev) => ({
      employeeIdentificationNumber: dev.employeeIdentificationNumber?.trim(),
      employeeName: dev.employeeName?.trim(),
      phoneNumber: dev.phoneNumber?.trim(),
      email: dev.email?.trim(),
      birthday: dev.birthday || null,
      joinedAt: dev.joinedAt || null,
      careerYears: dev.careerYears !== "" ? Number(dev.careerYears) : null,
      positionName: dev.positionName || null,
      departmentName: dev.departmentName || null,
      profileImageUrl: dev.profileImageUrl || null,
      salary: dev.salary !== "" ? Number(dev.salary) : null,
      techStackNames: dev.techStackNames || [],
    }));

    await registerDevelopers(payload);
    alert("등록에 성공했습니다.");
    await router.push({ name: "developer-list" });
  } catch (e) {
    console.error(e);
    alert("등록에 실패했습니다.");
  }
}
</script>
