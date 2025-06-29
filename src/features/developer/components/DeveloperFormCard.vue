<template>
  <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl space-y-6">
    <div class="grid grid-cols-2 gap-6">

      <!-- 이름 -->
      <div>
        <label for="name" class="text-sm text-gray-600 block mb-1">이름</label>
        <input id="name" type="text" placeholder="이름을 입력하세요" class="w-full border rounded-md p-2" />
      </div>

      <!-- 사번 -->
      <div>
        <label for="employeeId" class="text-sm text-gray-600 block mb-1">사번</label>
        <input id="employeeId" type="text" placeholder="사번을 입력하세요" class="w-full border rounded-md p-2" />
      </div>

      <!-- 전화번호 -->
      <div>
        <label for="phone" class="text-sm text-gray-600 block mb-1">전화번호</label>
        <input id="phone" type="text" placeholder="전화번호를 입력하세요" class="w-full border rounded-md p-2" />
      </div>

      <!-- 이메일 -->
      <div>
        <label for="email" class="text-sm text-gray-600 block mb-1">이메일</label>
        <input id="email" type="email" placeholder="이메일을 입력하세요" class="w-full border rounded-md p-2" />
      </div>

      <!-- 입사일 -->
      <div>
        <label for="joinedAt" class="text-sm text-gray-600 block mb-1">입사일</label>
        <input id="joinedAt" type="date" class="w-full border rounded-md p-2" />
      </div>

      <!-- 퇴사일 -->
      <div>
        <label for="leftAt" class="text-sm text-gray-600 block mb-1">퇴사일</label>
        <input id="leftAt" type="date" class="w-full border rounded-md p-2" />
      </div>

      <!-- 연차 -->
      <div>
        <label for="career" class="text-sm text-gray-600 block mb-1">연차</label>
        <input id="career" type="number" placeholder="예: 4" class="w-full border rounded-md p-2" />
      </div>

      <!-- 프로필 이미지 업로드 -->
      <div>
        <label for="profile" class="text-sm text-gray-600 block mb-1">프로필</label>
        <input id="profile" type="file" accept="image/*" class="w-full border rounded-md p-2" />
      </div>
    </div>

    <!-- 기술 스택 -->
    <div>
      <label class="text-sm text-gray-600 block mb-2">기술스택</label>
      <!-- 기술 스택 컴포넌트 or 반복 필드 -->
      <button class="border px-3 py-1 rounded-md text-sm text-gray-600 hover:bg-gray-50">+ 기술 추가</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'remove']);

const form = reactive(props.modelValue);

function onFileChange(e) {
  form.profileImage = e.target.files[0];
}

function emitRemove() {
  emit('remove');
}
</script>