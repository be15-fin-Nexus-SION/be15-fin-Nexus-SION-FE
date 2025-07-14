<template>
  <div v-if="authStore.memberId" class="p-8 space-y-8">
    <!-- 프로젝트 + 알람 제목 줄 -->
    <div class="flex gap-6 items-center">
      <div class="flex-1 text-xl font-bold">프로젝트</div>
      <div class="flex-1 text-xl font-bold">알람</div>
    </div>

    <!-- 프로젝트 + 알람 카드 줄 -->
    <div class="flex gap-6 items-start">
      <!-- 프로젝트 카드 -->
      <div class="flex-1">
        <ProjectCard v-if="project" :project="project" />
        <div
          v-else
          class="h-[178px] flex items-center justify-center text-gray-400 text-sm border rounded-xl"
        >
          현재 진행 중인 프로젝트가 없습니다.
        </div>
      </div>

      <!-- 알림 카드 -->
      <div class="flex-1">
        <NotificationList />
      </div>
    </div>

    <!-- 자격증 / 추천 교육 -->
    <div>
      <div class="text-xl font-bold mb-2">자격증 / 추천 교육</div>
      <div
        class="flex gap-6 p-6 bg-white rounded-xl shadow-[0_0_2px_rgba(0,0,0,0.25)]"
      >
        <!-- ✅ 자격증: 너비를 절반으로 제한 -->
        <div class="w-1/2">
          <CertificateList />
        </div>

        <!-- 추천 교육 -->
        <div class="w-1/2">
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="course in recommendedCourses"
              :key="course.id"
              class="rounded-xl overflow-hidden bg-white shadow-[0_0_2px_rgba(0,0,0,0.25)]"
            >
              <img
                :src="course.imageUrl"
                alt="course"
                class="w-full h-24 object-cover"
              />
              <div class="p-4">
                <div class="text-sm font-bold text-blue-600 mb-1">
                  [{{ course.category }}]
                </div>
                <div class="text-base font-semibold">{{ course.title }}</div>
                <div class="text-xs text-gray-500">{{ course.school }}</div>
                <a
                  :href="course.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-2 w-full bg-blue-600 text-white rounded px-3 py-1 text-sm block text-center"
                >
                  수강하기
                </a>
              </div>
            </div>
          </div>
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
import { ref, onMounted } from "vue";
import ProjectCard from "@/features/project/components/ProjectCard.vue";
import GrowthChart from "@/features/developer/components/GrowthChart.vue";
import NotificationList from "@/features/developer/components/NotificationList.vue";
import CertificateList from "@/features/developer/components/CertificateList.vue";
import { fetchProjectListByMember } from "@/api/project.js";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const project = ref(null);

const recommendedCourses = [
  {
    id: 1,
    title: "파이썬 실전 코딩",
    category: "백엔드",
    school: "서울사이버대학교",
    imageUrl:
      "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRvnzm8GJILkLybTeVNH00N6-wVhuiTP8eYbfBxDdzFMGbEGm_G",
    link: "https://www.kmooc.kr/",
  },
  {
    id: 2,
    title: "프론트엔드 기초",
    category: "프론트엔드",
    school: "패스트캠퍼스",
    imageUrl:
      "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRvnzm8GJILkLybTeVNH00N6-wVhuiTP8eYbfBxDdzFMGbEGm_G",
    link: "https://www.kmooc.kr/",
  },
  {
    id: 3,
    title: "데이터 분석 실습",
    category: "데이터",
    school: "멋쟁이사자처럼",
    imageUrl:
      "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRvnzm8GJILkLybTeVNH00N6-wVhuiTP8eYbfBxDdzFMGbEGm_G",
    link: "https://www.kmooc.kr/",
  },
  {
    id: 4,
    title: "클라우드 기초",
    category: "DevOps",
    school: "Inflearn",
    imageUrl:
      "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRvnzm8GJILkLybTeVNH00N6-wVhuiTP8eYbfBxDdzFMGbEGm_G",
    link: "https://www.kmooc.kr/",
  },
];

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
});
</script>
