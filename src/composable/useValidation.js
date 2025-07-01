import { ref } from "vue";

export function useValidation() {
  const passwordError = ref("");
  const phoneError = ref("");
  const emailError = ref("");

  function isPasswordValid(password) {
    if (!password) {
      passwordError.value = "비밀번호를 입력해주세요.";
      return false;
    }
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/;
    if (!regex.test(password)) {
      passwordError.value =
        "비밀번호는 최소 8자, 영문자, 숫자, 특수문자를 포함해야 합니다.";
      return false;
    }
    passwordError.value = "";
    return true;
  }

  function isPhoneNumberValid(phoneNumber) {
    if (!phoneNumber) {
      phoneError.value = "전화번호를 입력해주세요.";
      return false;
    }
    const regex = /^01[016789]\d{7,8}$/;
    if (!regex.test(phoneNumber)) {
      phoneError.value = "전화번호는 01로 시작하는 숫자 11자리여야 합니다.";
      return false;
    }
    phoneError.value = "";
    return true;
  }

  function isEmailValid(email) {
    if (!email) {
      emailError.value = "이메일을 입력해주세요.";
      return false;
    }
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!regex.test(email)) {
      emailError.value = "이메일 형식이 올바르지 않습니다.";
      return false;
    }
    emailError.value = "";
    return true;
  }

  function validateAll(form) {
    const isPasswordOk = isPasswordValid(form.password);
    const isPhoneOk = isPhoneNumberValid(form.phoneNumber);
    const isEmailOk = isEmailValid(form.email);

    return isPasswordOk && isPhoneOk && isEmailOk;
  }

  return {
    passwordError,
    phoneError,
    emailError,
    isPasswordValid,
    isPhoneNumberValid,
    isEmailValid,
    validateAll,
  };
}
