<template>
  <div class="bg-white p-8 rounded-xl shadow-base w-full max-w-3xl space-y-6">
    <div class="grid grid-cols-2 gap-6">
      <!-- 이름 -->
      <div>
        <label class="text-sm text-gray-600 block mb-3">
          이름<span class="text-red-500 ml-1">*</span>
        </label>
        <input v-model="form.employeeName" type="text" placeholder="이름" class="w-full border rounded-md p-2 text-sm" required />
      </div>

      <!-- 사번 -->
      <div>
        <label class="text-sm text-gray-600 block mb-3">
          사번<span class="text-red-500 ml-1">*</span>
        </label>
        <input v-model="form.employeeIdentificationNumber" type="text" placeholder="사번" class="w-full border rounded-md p-2 text-sm" required />
      </div>

      <!-- 전화번호 -->
      <div>
        <label class="text-sm text-gray-600 block mb-3">
          전화번호<span class="text-red-500 ml-1">*</span>
        </label>
        <input v-model="form.phoneNumber" type="text" placeholder="01012345678" class="w-full border rounded-md p-2 text-sm" required />
      </div>

      <!-- 이메일 -->
      <div>
        <label class="text-sm text-gray-600 block mb-3">
          이메일<span class="text-red-500 ml-1">*</span>
        </label>
        <input v-model="form.email" type="email" placeholder="이메일" class="w-full border rounded-md p-2 text-sm" required />
      </div>

      <!-- 입사일 -->
      <div>
        <label class="text-sm text-gray-600 block mb-3">
          입사일<span class="text-red-500 ml-1">*</span>
        </label>
        <input v-model="form.joinedAt" type="date" class="w-full border rounded-md p-2 text-sm" required />
      </div>

      <!-- 생년월일 -->
      <div>
        <label class="text-sm text-gray-600 block mb-3">
          생년월일<span class="text-red-500 ml-1">*</span>
        </label>
        <input v-model="form.birthday" type="date" class="w-full border rounded-md p-2 text-sm" required />
      </div>

      <!-- 연차 -->
      <div>
        <label class="text-sm text-gray-600 block mb-3">
          연차<span class="text-red-500 ml-1">*</span>
        </label>
        <input v-model.number="form.careerYears" type="number" class="w-full border rounded-md p-2 text-sm" required />
      </div>

      <!-- 연봉 -->
      <div>
        <label class="text-sm text-gray-600 block mb-3">
          연봉
        </label>
        <input v-model.number="form.salary" type="number" class="w-full border rounded-md p-2 text-sm" required />
      </div>

      <!-- 직급 -->
      <div>
        <label class="text-sm text-gray-600 block mb-3">직급</label>
        <select v-model="form.positionName" class="w-full border rounded-md p-2 text-sm">
          <option value="">선택 안함</option>
          <option v-for="pos in positionOptions" :key="pos" :value="pos">{{ pos }}</option>
        </select>
      </div>

      <!-- 부서 -->
      <div>
        <label class="text-sm text-gray-600 block mb-3">부서</label>
        <select v-model="form.departmentName" class="w-full border rounded-md p-2 text-sm">
          <option value="">선택 안함</option>
          <option v-for="dept in departmentOptions" :key="dept" :value="dept">{{ dept }}</option>
        </select>
      </div>
    </div>

    <!-- 프로필 이미지 -->
    <div>
      <label class="text-sm text-gray-600 block mb-3">프로필 이미지</label>
      <label class="inline-block border rounded-md px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
        프로필 업로드
        <input type="file" accept="image/*" @change="onFileChange" class="hidden" />
      </label>
      <span class="ml-2 text-sm text-gray-500">{{ selectedFileName || '선택된 파일 없음' }}</span>
      <p v-if="uploading" class="text-sm text-gray-400 mt-1">업로드 중...</p>
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
            @remove="removeTechStack(idx)"
        />
      </div>
      <button
          @click="emit('open-tech-modal', form.techStackNames)"
          type="button"
          class="border px-3 py-1 rounded-md text-sm text-gray-600 hover:bg-gray-50"
      >
        + 기술 추가
      </button>
    </div>

    <!-- 에러 메시지 -->
    <p v-if="firstErrorMessage" class="text-sm text-red-500">{{ firstErrorMessage }}</p>

    <!-- 삭제 버튼 -->
    <div class="flex justify-end">
      <button @click="emitRemove" type="button" class="text-sm text-red-500 hover:underline">삭제</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref, onMounted, computed } from 'vue';
import { fetchDepartmentList, fetchPositionList } from '@/api/member';
import { uploadImage } from '@/api/image';
import TechBadge from '@/components/badge/TechBadge.vue';

const props = defineProps({
  modelValue: Object,
  errorMessages: {
    type: Object,
    default: () => ({})
  }
});
const emit = defineEmits(['update:modelValue', 'remove', 'open-tech-modal']);

const form = reactive({});
const selectedFileName = ref('');
const uploading = ref(false);
const positionOptions = ref([]);
const departmentOptions = ref([]);

watch(
    () => props.modelValue,
    (newVal) => Object.assign(form, newVal),
    { immediate: true, deep: true }
);

watch(form, () => emit('update:modelValue', form), { deep: true });

async function onFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  selectedFileName.value = file.name;

  try {
    uploading.value = true;
    const res = await uploadImage(file, 'profile');
    form.profileImageUrl = res.data.url;
  } catch (err) {
    alert('이미지 업로드 실패');
    console.error(err);
  } finally {
    uploading.value = false;
  }
}

function emitRemove() {
  emit('remove');
}

function removeTechStack(index) {
  form.techStackNames.splice(index, 1);
}

const firstErrorMessage = computed(() => {
  const messages = Object.values(props.errorMessages);
  return messages.length > 0 ? messages[0] : null;
});

onMounted(async () => {
  try {
    const posRes = await fetchPositionList();
    positionOptions.value = posRes.data.data.map(p => p.positionName);
  } catch (e) {
    console.error('직급 목록 조회 실패', e);
  }

  try {
    const deptRes = await fetchDepartmentList();
    departmentOptions.value = deptRes.data.data.map(d => d.departmentName);
  } catch (e) {
    console.error('부서 목록 조회 실패', e);
  }
});
</script>