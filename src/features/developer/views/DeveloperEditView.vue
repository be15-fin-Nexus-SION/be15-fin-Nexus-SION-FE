<template>
  <div class="max-w-4xl mx-auto py-10 px-4 space-y-8">
    <h1 class="text-2xl font-bold mb-6">개발자 정보 수정</h1>

    <div class="bg-white p-8 space-y-6">
      <div class="grid grid-cols-2 gap-6">
        <!-- 이름 -->
        <div>
          <label class="text-sm text-gray-600 block mb-3"
            >이름<span class="text-red-500 ml-1">*</span></label
          >
          <input
            v-model="form.employeeName"
            type="text"
            class="w-full border rounded-md p-2 text-sm"
          />
          <p v-if="errors.employeeName" class="text-sm text-red-500 mt-1">
            {{ errors.employeeName }}
          </p>
        </div>

        <!-- 사번 -->
        <div>
          <label class="text-sm text-gray-600 block mb-3">사번</label>
          <input
            :value="employeeId"
            disabled
            class="w-full border rounded-md p-2 text-sm bg-gray-100 text-gray-500"
          />
        </div>

        <!-- 전화번호 -->
        <div>
          <label class="text-sm text-gray-600 block mb-3"
            >전화번호<span class="text-red-500 ml-1">*</span></label
          >
          <input
            v-model="form.phoneNumber"
            type="text"
            class="w-full border rounded-md p-2 text-sm"
          />
          <p v-if="errors.phoneNumber" class="text-sm text-red-500 mt-1">
            {{ errors.phoneNumber }}
          </p>
        </div>

        <!-- 이메일 -->
        <div>
          <label class="text-sm text-gray-600 block mb-3"
            >이메일<span class="text-red-500 ml-1">*</span></label
          >
          <input
            v-model="form.email"
            type="email"
            class="w-full border rounded-md p-2 text-sm"
          />
          <p v-if="errors.email" class="text-sm text-red-500 mt-1">
            {{ errors.email }}
          </p>
        </div>

        <!-- 입사일 -->
        <div>
          <label class="text-sm text-gray-600 block mb-3"
            >입사일<span class="text-red-500 ml-1">*</span></label
          >
          <input
            v-model="form.joinedAt"
            type="date"
            class="w-full border rounded-md p-2 text-sm"
          />
          <p v-if="errors.joinedAt" class="text-sm text-red-500 mt-1">
            {{ errors.joinedAt }}
          </p>
        </div>

        <!-- 생년월일 -->
        <div>
          <label class="text-sm text-gray-600 block mb-3"
            >생년월일<span class="text-red-500 ml-1">*</span></label
          >
          <input
            v-model="form.birthday"
            type="date"
            class="w-full border rounded-md p-2 text-sm"
          />
          <p v-if="errors.birthday" class="text-sm text-red-500 mt-1">
            {{ errors.birthday }}
          </p>
        </div>

        <!-- 연차 -->
        <div>
          <label class="text-sm text-gray-600 block mb-3"
            >연차<span class="text-red-500 ml-1">*</span></label
          >
          <input
            v-model.number="form.careerYears"
            type="number"
            class="w-full border rounded-md p-2 text-sm"
          />
          <p v-if="errors.careerYears" class="text-sm text-red-500 mt-1">
            {{ errors.careerYears }}
          </p>
        </div>

        <!-- 연봉 -->
        <div>
          <label class="text-sm text-gray-600 block mb-3">연봉</label>
          <input
            v-model.number="form.salary"
            type="number"
            step="1000000"
            class="w-full border rounded-md p-2 text-sm"
            required
          />
        </div>

        <!-- 직급 -->
        <div>
          <label class="text-sm text-gray-600 block mb-3">직급</label>
          <select
            v-model="form.positionName"
            class="w-full border rounded-md p-2 text-sm"
          >
            <option value="">선택 안함</option>
            <option v-for="pos in positionOptions" :key="pos" :value="pos">
              {{ pos }}
            </option>
          </select>
        </div>

        <!-- 부서 -->
        <div>
          <label class="text-sm text-gray-600 block mb-3">부서</label>
          <select
            v-model="form.departmentName"
            class="w-full border rounded-md p-2 text-sm"
          >
            <option value="">선택 안함</option>
            <option v-for="dept in departmentOptions" :key="dept" :value="dept">
              {{ dept }}
            </option>
          </select>
        </div>
      </div>

      <!-- 프로필 이미지 -->
      <div>
        <label class="text-sm text-gray-600 block mb-3">프로필 이미지</label>
        <label
          class="inline-block border rounded-md px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          프로필 업로드
          <input
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="hidden"
          />
        </label>
        <span class="ml-2 text-sm text-gray-500">{{
          form.profileImageUrl ? "이미지 선택됨" : "선택된 파일 없음"
        }}</span>
        <img
          v-if="form.profileImageUrl"
          :src="form.profileImageUrl"
          alt="미리보기"
          class="mt-2 w-24 h-24 object-cover rounded-full border"
        />
      </div>

      <!-- 기술 스택 -->
      <div>
        <label class="text-sm text-gray-600 block mb-3">기술스택</label>
        <div class="flex flex-wrap gap-2 mb-2">
          <TechBadge
            v-for="(tech, idx) in form.techStackNames"
            :key="tech"
            :label="tech"
            :showClose="true"
            @remove="form.techStackNames.splice(idx, 1)"
          />
        </div>
        <button
          type="button"
          @click="openModal"
          class="border px-3 py-1 rounded-md text-sm text-gray-600 hover:bg-gray-50"
        >
          + 기술 추가
        </button>
      </div>

      <!-- 버튼 영역 -->
      <div class="flex justify-end gap-2">
        <button
          type="button"
          @click="isConfirmOpen = true"
          class="px-6 py-2 bg-primary text-white rounded-md"
        >
          수정
        </button>
        <button
          type="button"
          @click="cancel"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
        >
          취소
        </button>
      </div>
    </div>

    <TechStackSelectModal
      v-if="isModalOpen"
      :all-tech-stacks="allTechStacks"
      :initial-selected="form.techStackNames"
      @apply="applyTechStacks"
      @close="isModalOpen = false"
    />

    <!-- 확인 모달 -->
    <ConfirmModal
      v-if="isConfirmOpen"
      message="수정하시겠습니까?"
      confirmText="확인"
      @confirm="submit"
      @close="isConfirmOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  fetchDeveloperDetail,
  fetchTechStacksByEmployeeId,
  updateDeveloper,
  fetchPositionList,
  fetchDepartmentList,
} from "@/api/member";
import { fetchAllTechStacks } from "@/api/techstack.js";
import { uploadImage } from "@/api/image.js";
import TechBadge from "@/components/badge/TechBadge.vue";
import TechStackSelectModal from "@/components/modal/TechStackSelectModal.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import { showErrorToast, showSuccessToast } from "@/utills/toast.js";

const route = useRoute();
const router = useRouter();
const employeeId = route.params.employeeId;

const form = reactive({
  employeeName: "",
  phoneNumber: "",
  birthday: "",
  joinedAt: "",
  email: "",
  careerYears: 0,
  positionName: "",
  departmentName: "",
  profileImageUrl: "",
  salary: null,
  techStackNames: [],
});

const errors = reactive({});
const allTechStacks = ref([]);
const positionOptions = ref([]);
const departmentOptions = ref([]);
const isModalOpen = ref(false);
const isConfirmOpen = ref(false);

function formatDate(isoString) {
  return isoString?.split("T")[0] ?? "";
}

function validate() {
  Object.keys(errors).forEach((key) => delete errors[key]);
  const errs = {};
  if (!form.employeeName) errs.employeeName = "이름은 필수 입력 사항입니다.";
  if (!form.phoneNumber) errs.phoneNumber = "전화번호는 필수 입력 사항입니다.";
  else if (!/^010\d{8}$/.test(form.phoneNumber))
    errs.phoneNumber =
      "전화번호는 010으로 시작하는 11자리 숫자 형식이어야 합니다.";
  if (!form.email) errs.email = "이메일은 필수 입력 사항입니다.";
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
    errs.email = "이메일 형식이 올바르지 않습니다.";
  if (!form.birthday) errs.birthday = "생년월일은 필수 입력 사항입니다.";
  if (!form.joinedAt) errs.joinedAt = "입사일은 필수 입력 사항입니다.";
  if (form.careerYears === "" || form.careerYears === null)
    errs.careerYears = "연차는 필수 입력 사항입니다.";

  Object.assign(errors, errs);
  return Object.keys(errs).length === 0;
}

function openModal() {
  isModalOpen.value = true;
}

function applyTechStacks(newStacks) {
  form.techStackNames = [...newStacks];
  isModalOpen.value = false;
}

async function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const res = await uploadImage(file);
    form.profileImageUrl = res.data.url;
  } catch (err) {
    showErrorToast("이미지 업로드에 실패했습니다.");
  }
}

async function submit() {
  isConfirmOpen.value = false;
  if (!validate()) {
    showErrorToast("입력값을 다시 확인해주세요.");
    return;
  }

  const payload = {
    ...form,
    salary: form.salary === "" || form.salary === null ? null : form.salary,
    positionName: form.positionName === "" ? null : form.positionName,
    departmentName: form.departmentName === "" ? null : form.departmentName,
    profileImageUrl: form.profileImageUrl === "" ? null : form.profileImageUrl,
  };

  try {
    await updateDeveloper(employeeId, payload);
    showSuccessToast("수정이 완료되었습니다.");
    router.push({ name: "developer-detail", params: { employeeId } });
  } catch (e) {
    showErrorToast("수정에 실패했습니다.");
  }
}

function cancel() {
  router.back();
}

onMounted(async () => {
  try {
    const [detailRes, techRes, allTechRes, posRes, deptRes] = await Promise.all(
      [
        fetchDeveloperDetail(employeeId),
        fetchTechStacksByEmployeeId(employeeId),
        fetchAllTechStacks(),
        fetchPositionList(),
        fetchDepartmentList(),
      ],
    );

    const dev = detailRes.data.data;

    Object.assign(form, {
      employeeName: dev.name,
      phoneNumber: dev.phoneNumber,
      birthday: formatDate(dev.birthday),
      joinedAt: formatDate(dev.joinedAt),
      email: dev.email,
      careerYears: dev.careerYears,
      positionName: dev.position,
      departmentName: dev.department,
      profileImageUrl: dev.profileImageUrl,
      salary: dev.salary,
      techStackNames: techRes.data.data.map((t) => t.techStackName),
    });

    allTechStacks.value = allTechRes.data.data.techStacks;
    positionOptions.value = posRes.data.data.map((p) => p.positionName);
    departmentOptions.value = deptRes.data.data.map((d) => d.departmentName);
  } catch (e) {
    console.error("개발자 정보 로딩 실패:", e);
  }
});
</script>
