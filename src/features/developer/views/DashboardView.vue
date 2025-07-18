<template>
  <div v-if="authStore.memberId" class="p-8 space-y-8">
    <!-- 프로젝트 + 알림 카드 줄 -->
    <div class="flex gap-6 items-start">
      <!-- 프로젝트 카드 -->
      <div
        class="flex-1 p-6 rounded-xl shadow-lg transition-all bg-gradient-to-br from-[#f3e5f5] to-[#f8f4fc] border border-[#ce93d8]"
      >
        <h3 class="text-[18px] font-bold mb-5 text-[#333]">📢 내 프로젝트</h3>
        <div class="flex flex-col h-[200px]">
          <ProjectCard v-if="project" :project="project" />
          <div
            v-else
            class="h-[178px] flex items-center justify-center text-gray-400 text-sm border rounded-xl"
          >
            현재 진행 중인 프로젝트가 없습니다.
          </div>
        </div>
      </div>

      <!-- 알림 카드 -->
      <div
        class="flex-1 p-6 space-y-5 rounded-xl shadow-lg transition-all bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
      >
        <h3 class="text-[18px] font-bold mb-5 text-[#333]">📥 내 알림</h3>
        <NotificationList />
      </div>
    </div>

    <!-- 자격증 / 추천 교육 -->
    <div>
      <div class="text-xl font-bold mb-2">자격증 / 추천 교육</div>
      <div
        class="flex gap-6 p-6 bg-white rounded-xl shadow-[0_0_2px_rgba(0,0,0,0.25)]"
      >
        <!-- 자격증 -->
        <div class="w-1/2">
          <router-link to="/self-development/certificates">
            <CertificateList />
          </router-link>
        </div>

        <!-- 추천 교육 -->
        <div class="w-1/2">
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="course in previewCourses"
              :key="course.trainingId"
              class="relative w-[250px] h-[280px] bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <!-- 썸네일 -->
              <div class="relative w-full h-40">
                <img
                  :src="course.imageUrl"
                  alt="course"
                  class="w-full h-full object-cover"
                />

                <!-- 오버레이 -->
                <div
                  v-if="
                    course.recommendationReason || course.trainingDescription
                  "
                  class="absolute inset-0 bg-black bg-opacity-80 text-white text-xs p-4 opacity-0 hover:opacity-100 transition-opacity z-10 overflow-y-auto flex flex-col items-center justify-center text-center"
                >
                  <p
                    v-if="course.recommendationReason"
                    class="mb-4 whitespace-pre-wrap font-semibold text-sm"
                  >
                    {{ course.recommendationReason }}
                  </p>
                  <p
                    v-if="course.trainingDescription"
                    class="whitespace-pre-wrap leading-snug text-xs"
                  >
                    {{ course.trainingDescription }}
                  </p>
                </div>
              </div>

              <!-- 본문 -->
              <div class="p-4 flex flex-col items-center text-center space-y-1">
                <!-- 카테고리 -->
                <p
                  v-if="course.trainingCategory"
                  class="text-xs inline-block bg-gray-100 text-blue-600 font-semibold px-2 py-0.5 rounded-full"
                >
                  {{ course.trainingCategory }}
                </p>

                <!-- 교육명 -->
                <h3 class="font-semibold text-sm truncate w-full">
                  {{ course.trainingName }}
                </h3>

                <!-- 기관명 -->
                <p class="text-gray-500 text-xs truncate w-full">
                  {{ course.organization }}
                </p>

                <!-- 수강하기 버튼 -->
                <a
                  v-if="course.videoUrl"
                  :href="course.videoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-2 bg-blue-500 text-white w-full py-2 text-sm rounded hover:bg-blue-600 text-center"
                >
                  수강하기
                </a>
              </div>
            </div>
          </div>

          <!-- 전체 보기 링크 -->
          <router-link
            to="/self-development/recommend"
            class="block mt-4 text-sm text-right text-blue-600 hover:underline"
          >
            추천 교육 전체 보기 →
          </router-link>
        </div>
      </div>
    </div>

    <!-- 성장 추이 -->
    <div>
      <div class="text-xl font-bold mb-2">성장 추이</div>
      <div
        class="p-6 bg-white rounded-xl shadow-[0_0_2px_rgba(0,0,0,0.25)] w-full"
      >
        <GrowthChart :employeeId="authStore.memberId" />
      </div>
    </div>
  </div>

  <div v-else class="p-8 text-center text-gray-400">
    로그인 후 이용 가능한 화면입니다.
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useTrainingStore } from "@/stores/useTrainingStore";
import { storeToRefs } from "pinia";

import ProjectCard from "@/features/project/components/ProjectCard.vue";
import GrowthChart from "@/features/developer/components/GrowthChart.vue";
import NotificationList from "@/features/developer/components/NotificationList.vue";
import CertificateList from "@/features/developer/components/CertificateList.vue";
import { fetchProjectListByMember } from "@/api/project.js";

// 인증 정보
const authStore = useAuthStore();
const project = ref(null);

// 추천 교육 로딩
const trainingStore = useTrainingStore();
const { trainings } = storeToRefs(trainingStore);
const previewCourses = computed(() => trainings.value.slice(0, 4));

onMounted(async () => {
  try {
    const { data } = await fetchProjectListByMember(authStore.memberId, 0, 1);
    const content = data?.data?.content ?? [];
    if (content.length > 0) {
      project.value = content[0];
    }
  } catch (error) {
    console.error("❌ 사용자 프로젝트 목록 조회 실패:", error);
  }

  // 추천 교육 데이터 로딩
  await trainingStore.fetchRecommendations();
});
</script>
