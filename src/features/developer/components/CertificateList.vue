<template>
  <div class="flex flex-col flex-1 w-full h-[470px]">
    <div v-if="certificates.length === 0" class="text-sm text-gray-400">
      등록된 자격증이 없습니다.
    </div>
    <ul v-else class="space-y-5 pt-3 text-sm overflow-y-auto">
      <li
        v-for="cert in certificates"
        :key="cert.certificateName"
        class="flex justify-between items-center border-b pb-3 px-3 text-bodyMd"
      >
        <span>{{ cert.certificateName }}</span>
        <span
          :class="
            acquiredSet.has(cert.certificateName)
              ? 'text-green-500'
              : 'text-gray-300'
          "
        >
          ✔
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fetchAllCertificates, fetchUserCertificates } from "@/api/certificate";
import { useAuthStore } from "@/stores/auth";

const certificates = ref([]);
const acquiredSet = ref(new Set());
const authStore = useAuthStore();

onMounted(async () => {
  try {
    const allResponse = await fetchAllCertificates();
    console.log("authStore.memberId: ", authStore.memberId);
    const userResponse = await fetchUserCertificates(authStore.memberId);

    certificates.value = allResponse.data?.data ?? [];

    const userCerts = userResponse.data?.data ?? [];
    acquiredSet.value = new Set(userCerts.map((c) => c.certificateName));
  } catch (e) {
    console.error("❌ 자격증 정보 불러오기 실패:", e);
  }
});
</script>
