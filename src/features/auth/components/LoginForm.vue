<script setup>
import { reactive, ref } from "vue";
import { useValidation } from "@/composable/useValidation.js";
import ShowIcon from "@/assets/icons/Show.svg";
import HideIcon from "@/assets/icons/Hide.svg";
import Close_LG from "@/assets/icons/Close_LG.svg";

const emit = defineEmits(["submit"]);

const showPassword = ref(false);

const { passwordError, isPasswordValid } = useValidation();

const form = reactive({
  employeeIdentificationNumber: "",
  password: "",
});

const fields = [
  { key: "employeeIdentificationNumber", type: "text", placeholder: "사번" },
  { key: "password", type: "password", placeholder: "비밀번호" },
];

function handleBlur(fieldKey) {
  if (fieldKey === "password") {
    isPasswordValid(form.password, true);
  }
}

function onSubmit() {
  const isValid = isPasswordValid(form.password, true);

  if (!isValid) {
    console.log("유효성 검사 실패");
    return;
  }

  emit("submit", form);
}
</script>

<template>
  <form class="register-form" @submit.prevent="onSubmit">
    <div class="input-wrapper" v-for="field in fields" :key="field.key">
      <div class="input-flex">
        <input
          :type="
            field.key === 'password'
              ? showPassword
                ? 'text'
                : 'password'
              : field.type
          "
          v-model="form[field.key]"
          :placeholder="field.placeholder"
          @blur="handleBlur(field.key)"
        />

        <!-- 비밀번호 보기 버튼 -->
        <button
          v-if="field.key === 'password'"
          type="button"
          class="eye-btn"
          @click="showPassword = !showPassword"
        >
          <img
            :src="showPassword ? HideIcon : ShowIcon"
            alt="비밀번호 보기 토글"
            class="eye-icon"
          />
        </button>

        <!-- 입력값 지우기 버튼 -->
        <button
          v-if="form[field.key]"
          type="button"
          class="clear-btn"
          @click="form[field.key] = ''"
        >
          <img :src="Close_LG" alt="닫기 버튼" class="close-icon" />
        </button>
      </div>

      <!-- 에러 메시지 -->
      <p v-if="field.key === 'password' && passwordError" class="error-msg">
        {{ passwordError }}
      </p>
    </div>
    <button type="submit">로그인</button>
  </form>
</template>

<style scoped>
.register-form {
  @apply flex flex-col w-[60%];
}

.input-wrapper {
  @apply mb-4;
}

.input-flex {
  @apply border border-gray-300 rounded m-1 flex items-center justify-between;
}

.input-flex input {
  @apply pl-3 py-3 pr-3 rounded w-full;
}

.eye-btn {
  @apply pr-3 bg-transparent border-none cursor-pointer;
}

.eye-icon {
  @apply w-5 h-5;
}

.clear-btn {
  @apply pr-3 bg-transparent border-none cursor-pointer;
}

.close-icon {
  @apply w-4 h-4;
}

.register-form button[type="submit"] {
  @apply mt-4 py-3 bg-[#a1bcd1] text-white border-none rounded cursor-pointer;
}

.register-form button[type="submit"]:hover {
  @apply bg-[#88a8bc];
}

.error-msg {
  @apply text-semantic-warning text-caption mt-1;
}
</style>
