<script setup>
import { reactive, ref } from "vue";
import { useValidation } from "@/composable/useValidation.js";
import ShowIcon from "@/assets/icons/Show.svg";
import HideIcon from "@/assets/icons/Hide.svg";
import Close_LG from "@/assets/icons/Close_LG.svg";
import { showErrorToast } from "@/utills/toast.js";

const emit = defineEmits(["submit"]);

const showPassword = ref(false);

const form = reactive({
  employeeIdentificationNumber: "",
  password: "",
  birthday: "",
  email: "",
  phoneNumber: "",
  employeeName: "",
});

const fields = [
  { key: "employeeIdentificationNumber", type: "text", placeholder: "사번" },
  { key: "password", type: "password", placeholder: "비밀번호" },
  { key: "birthday", type: "text", placeholder: "생년월일: 2000.01.01" },
  { key: "email", type: "email", placeholder: "이메일" },
  { key: "phoneNumber", type: "tel", placeholder: "전화번호" },
  { key: "employeeName", type: "text", placeholder: "이름" },
];

const {
  passwordError,
  phoneError,
  emailError,
  birthdayError,
  isPasswordValid,
  isPhoneNumberValid,
  isEmailValid,
  isBirthdayValid,
  validateAll,
} = useValidation();

const validators = {
  password: isPasswordValid,
  phoneNumber: isPhoneNumberValid,
  email: isEmailValid,
  birthday: isBirthdayValid,
};

function handleBlur(fieldKey) {
  const validator = validators[fieldKey];
  if (validator) {
    validator(form[fieldKey]);
  }
}

function onSubmit() {
  const birthFormatted = form.birthday ? form.birthday.replaceAll(".", "") : "";
  const payload = { ...form, birthday: birthFormatted };

  if (!validateAll(payload)) {
    showErrorToast("입력값을 확인해주세요.");
    return;
  }

  emit("submit", payload);
}

const errorMessages = {
  password: passwordError,
  phoneNumber: phoneError,
  email: emailError,
  birthday: birthdayError,
};
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
      <p v-if="errorMessages[field.key]" class="error-msg">
        {{ errorMessages[field.key] }}
      </p>
    </div>
    <button type="submit">회원가입</button>
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
  @apply mr-3 bg-transparent border-none cursor-pointer;
}

.eye-icon {
  @apply w-5 h-5;
}

.clear-btn {
  @apply mr-3 bg-transparent border-none cursor-pointer;
}

.close-icon {
  @apply w-4 h-4;
}

.register-form button[type="submit"] {
  @apply mt-4 py-3 bg-primary hover:bg-primary-hover text-white border-none rounded cursor-pointer;
}

.error-msg {
  @apply text-semantic-warning text-caption mt-1;
}
</style>
