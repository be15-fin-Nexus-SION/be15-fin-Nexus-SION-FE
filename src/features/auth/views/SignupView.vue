<script setup>
import { reactive, watch, ref } from "vue";
import { useValidation } from "@/composable/useValidation.js";
import ShowIcon from "@/assets/icons/Show.svg";
import HideIcon from "@/assets/icons/Hide.svg";

const showPassword = ref(false);

const form = reactive({
  company: "",
  password: "",
  birth: "",
  email: "",
  phone: "",
  name: "",
});

const fields = [
  { key: "company", type: "text", placeholder: "사번" },
  { key: "password", type: "password", placeholder: "비밀번호" },
  { key: "birth", type: "date", placeholder: "생년월일" },
  { key: "email", type: "email", placeholder: "이메일" },
  { key: "phone", type: "tel", placeholder: "전화번호" },
  { key: "name", type: "text", placeholder: "이름" },
];

const {
  passwordError,
  phoneError,
  emailError,
  isPasswordValid,
  isPhonenumberValid,
  isEmailValid,
} = useValidation();

watch(
  () => form.password,
  (newVal) => {
    isPasswordValid(newVal);
  },
);

watch(
  () => form.phone,
  (newVal) => {
    isPhonenumberValid(newVal);
  },
);

watch(
  () => form.email,
  (newVal) => {
    isEmailValid(newVal);
  },
);

const handleSubmit = () => {
  // 1️⃣ birth 가공
  const birthFormatted = form.birth ? form.birth.replaceAll("-", "") : "";

  // 2️⃣ form에서 birth 제외하고 payload 만들기
  const { birth, ...formWithoutBirth } = form;

  const payload = {
    ...formWithoutBirth,
    birth: birthFormatted,
  };

  console.log("회원가입 정보 payload:", payload);

  // TODO: 회원가입 처리 로직 추가
};
</script>

<template>
  <div class="register-container">
    <div class="logo-wrapper">
      <img src="@/assets/sion-logo.svg" alt="SION Logo" class="logo" />
    </div>
    <form class="register-form" @submit.prevent="handleSubmit">
      <div class="input-wrapper" v-for="field in fields" :key="field.key">
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
          required
        />

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

        <button
          type="button"
          class="clear-btn"
          v-if="form[field.key]"
          @click="form[field.key] = ''"
        >
          ×
        </button>
        <p v-if="field.key === 'password' && passwordError" class="error-msg">
          {{ passwordError }}
        </p>
        <p v-if="field.key === 'phone' && phoneError" class="error-msg">
          {{ phoneError }}
        </p>
        <p v-if="field.key === 'email' && emailError" class="error-msg">
          {{ emailError }}
        </p>
      </div>
      <button type="submit">회원가입</button>
    </form>
  </div>
</template>

<style scoped>
.register-container {
  @apply flex flex-col items-center justify-center min-h-screen pb-28;
}

.logo-wrapper {
  @apply mb-8;
}

.logo {
  @apply w-[250px];
}

.register-form {
  @apply flex flex-col w-[60%];
}

.input-wrapper {
  @apply relative mb-2;
}

.input-wrapper input {
  @apply w-full py-3 pr-8 pl-3 border border-gray-300 rounded;
}

.clear-btn {
  @apply absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-[1.2rem] cursor-pointer text-gray-500;
}

.clear-btn:hover {
  @apply text-gray-800;
}

.register-form button[type="submit"] {
  @apply mt-4 py-3 bg-[#a1bcd1] text-white border-none rounded cursor-pointer;
}

.register-form button[type="submit"]:hover {
  @apply bg-[#88a8bc];
}
.error-msg {
  @apply text-semantic-warning text-caption mt-2;
}

.eye-btn {
  @apply absolute right-10 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer;
}

.eye-icon {
  @apply w-5 h-5;
}
</style>
