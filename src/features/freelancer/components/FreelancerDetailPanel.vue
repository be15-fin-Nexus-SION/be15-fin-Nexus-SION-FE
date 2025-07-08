<template>
  <div class="w-[640px] space-y-6">
    <!-- 헤더 -->
    <div class="flex justify-between items-start">
      <div class="text-2xl font-bold">개인정보</div>
      <button
        @click="$emit('close')"
        class="text-gray-400 hover:text-gray-600 text-xl"
        aria-label="닫기"
      >
        ✕
      </button>
    </div>

    <!-- 프로필 + 상세 -->
    <div class="flex gap-4">
      <!-- 프로필 카드 (중앙 정렬 적용) -->
      <div
        class="w-1/3 bg-white p-6 rounded-xl custom-shadow flex flex-col justify-center items-center text-center"
      >
        <img
          :src="freelancer.profileImageUrl || '/default-profile.png'"
          class="w-32 h-32 rounded-full object-cover mb-4"
          alt="프로필 이미지"
        />
        <div class="text-orange-500 font-bold text-xl">
          {{ freelancer.grade }}
        </div>
        <div class="text-lg font-medium mt-2">
          {{ freelancer.name }} {{ freelancer.isEmployee ? "사원" : "" }}
        </div>
      </div>

      <!-- 상세 카드 -->
      <div
        class="w-2/3 bg-white p-6 rounded-xl custom-shadow text-sm space-y-6 break-words"
      >
        <div>
          <div class="font-bold mb-1">사번</div>
          <div>{{ freelancer.freelancerId }}</div>
        </div>
        <div>
          <div class="font-bold mb-1">이력서</div>
          <a
            :href="freelancer.resumeUrl"
            class="text-blue-500 underline break-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            이력서 보기
          </a>
        </div>
        <!-- 연락처 -->
        <div>
          <div class="font-bold mb-1">연락처</div>
          <div>{{ freelancer.phoneNumber }} | {{ freelancer.email }}</div>
        </div>

        <div>
          <div class="font-bold mb-1">년차</div>
          <div>{{ freelancer.careerYears }}년차</div>
        </div>
      </div>
    </div>

    <!-- 등록 버튼 -->
    <div class="flex justify-end mt-4">
      <button
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
        :disabled="loading"
        @click="handleRegister"
      >
        {{ loading ? "등록 중..." : "등록" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { registerFreelancerAsMember } from "@/api/freelancer";
import { showSuccessToast, showErrorToast } from "@/utills/toast";

const props = defineProps({ freelancer: Object });
const emit = defineEmits(["close", "refresh"]);
const loading = ref(false);

onMounted(() => {
  console.log("📌 프리랜서 상세 정보 확인:", props.freelancer);
});

async function handleRegister() {
  if (loading.value) return;
  loading.value = true;

  try {
    await registerFreelancerAsMember(props.freelancer.freelancerId);
    showSuccessToast("등록 완료");
    emit("close");
    emit("refresh");
  } catch (e) {
    showErrorToast("등록 실패");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.custom-shadow {
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.25);
}
</style>
