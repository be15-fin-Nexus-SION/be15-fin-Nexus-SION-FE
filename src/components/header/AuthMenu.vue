<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";
import { logout } from "@/api/member.js";
import { showErrorToast, showSuccessToast } from "@/utills/toast.js";
import BasicProfile from "@/assets/icons/Basic_Profile.svg";
import AuthModal from "@/components/modal/AuthModal.vue";
import { useNotificationStore } from "@/stores/notification.js";
import BasicModal from "@/components/modal/BasicModal.vue";

const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const showModal = ref(false);
const modalPosition = ref({});

const emit = defineEmits(["open-notification-modal"]);

const openModal = () => {
  const profileEl = document.querySelector(".profile");
  if (profileEl) {
    const rect = profileEl.getBoundingClientRect();
    modalPosition.value = {
      position: "absolute",
      top: `${rect.bottom + 11}px`,
      left: `${rect.left - 25}px`,
    };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const goToAdminPage = () => {
  router.push("/admin/tech-stacks");
  closeModal();
};

const handleLogout = async () => {
  try {
    await logout();
    showSuccessToast("로그아웃 되었습니다.");
    authStore.clearAuth();
    await router.push("/login");
  } catch (e) {
    console.error("로그아웃 API 실패", e);
    showErrorToast("로그아웃이 실패했습니다. 다시 시도해주세요.");
  }
};

function handleNotificationModal() {
  emit("open-notification-modal");
  closeModal();
}
</script>

<template>
  <div class="auth-container">
    <template v-if="authStore.isAuthenticated">
      <div class="profile" @click="openModal">
        <!-- ✅ 프로필 이미지 로딩 -->
        <img
          :src="authStore.profileImage || BasicProfile"
          alt="프로필 이미지"
        />
        <span
          v-if="notificationStore.hasUnreadNotification"
          class="absolute top-[6px] right-[-1px] w-2 h-2 rounded-full bg-red-500 animate-bounce"
        ></span>
      </div>

      <!-- ✅ 관리자일 때 AuthModal -->
      <AuthModal
        v-if="showModal && authStore.memberRole === 'ADMIN'"
        :top-label="'관리자 설정'"
        middle-label="알림"
        bottom-label="로그아웃"
        :style="modalPosition"
        @top="goToAdminPage"
        @middle="handleNotificationModal"
        @bottom="handleLogout"
        @close="closeModal"
      />

      <!-- ✅ 일반 사용자일 때 BasicModal -->
      <BasicModal
        v-else-if="showModal"
        :top-label="'알림'"
        :bottom-label="'로그아웃'"
        :style="modalPosition"
        @top="handleNotificationModal"
        @bottom="handleLogout"
        @close="closeModal"
      />
    </template>

    <template v-else>
      <router-link to="/login" class="auth-text">로그인</router-link>
      <router-link to="/signup" class="auth-text">회원가입</router-link>
    </template>
  </div>
</template>

<style scoped>
.auth-container {
  @apply flex flex-row items-center gap-[10px];
}

.auth-text {
  @apply w-[91px] h-[63px] text-[18px] leading-[22px] font-semibold text-black flex items-center justify-center;
}

.auth-text:hover {
  color: #6574f6;
}

.profile {
  @apply relative w-[52px] h-[52px] flex items-center justify-center bg-white rounded-full;
  cursor: pointer;
}

.profile img {
  @apply w-[52px] h-[52px] object-cover rounded-full border-2 border-gray-300;
}
</style>
