import { ref } from "vue";

export function useValidation() {
  const passwordError = ref("");
  const phoneError = ref("");
  const emailError = ref("");
  const birthdayError = ref("");

  function isPasswordValid(password, isLogin = false) {
    if (!password) {
      passwordError.value = "비밀번호를 입력해주세요.";
      return false;
    }
    if (isLogin) {
      passwordError.value = "";
      return true;
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
      phoneError.value =
        "전화번호는 01로 시작하는 10자리 또는 11자리 숫자여야 합니다.";
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

  function isBirthdayValid(birthday) {
    if (!birthday) {
      birthdayError.value = "생년월일을 입력해주세요.";
      return false;
    }

    const clean = birthday.replaceAll(".", "");
    const regex = /^\d{8}$/;

    if (!regex.test(clean)) {
      birthdayError.value = "생년월일 형식이 올바르지 않습니다. 예: 2000.01.01";
      return false;
    }

    const year = parseInt(clean.slice(0, 4));
    const month = parseInt(clean.slice(4, 6)) - 1; // JS는 0부터 시작
    const day = parseInt(clean.slice(6, 8));
    const date = new Date(year, month, day);

    const now = new Date();
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      console.log(date.getFullYear(), date.getMonth(), date.getDate());
      birthdayError.value = "존재하지 않는 날짜입니다.";
      return false;
    }

    if (date > now) {
      birthdayError.value = "생년월일은 미래일 수 없습니다.";
      return false;
    }

    birthdayError.value = "";
    return true;
  }

  function validateAll(form) {
    const isPasswordOk = isPasswordValid(form.password);
    const isPhoneOk = isPhoneNumberValid(form.phoneNumber);
    const isEmailOk = isEmailValid(form.email);
    const isBirthdayOk = isBirthdayValid(form.birthday);

    return isPasswordOk && isPhoneOk && isEmailOk && isBirthdayOk;
  }

  return {
    passwordError,
    phoneError,
    emailError,
    birthdayError,
    isPasswordValid,
    isPhoneNumberValid,
    isEmailValid,
    isBirthdayValid,
    validateAll,
  };
}
