<template>
  <component :is="sidebarComponent" :items="sidebarItems" />
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import AdminSidebar from "./AdminSettingSidebar.vue";
import StatisticsSidebar from "./StatisticsSidebar.vue";
import DeveloperSidebar from "@/features/developer/components/DeveloperSidebar.vue";

const props = defineProps({
  viewType: {
    type: String,
    required: true,
    validator: (val) =>
      ["adminSetting", "statistics", "developerSelf"].includes(val),
  },
});

const route = useRoute();

// 사이드바 항목 목록
const rawItems = computed(() => {
  switch (props.viewType) {
    case "adminSetting":
      return [
        { label: "기술 스택 관리", to: "/admin/tech-stacks" },
        { label: "직무 관리", to: "/admin/jobs" },
        { label: "도메인 관리", to: "/admin/domains" },
        { label: "고객사 관리", to: "/admin/clients" },
        { label: "구간별 단가 관리", to: "/admin/grade-per-unit-price" },
        { label: "초기 스택 점수 관리", to: "/admin/initial-tech-stack" },
        { label: "자격증 종류 관리", to: "/admin/certificates" },
        { label: "자격증 승인 관리", to: "/admin/certificates/approval" },
      ];
    case "developerSelf":
      return [
        { label: "추천 교육 조회", to: "/self-development/recommend" },
        { label: "자격증 종류 조회", to: "/self-development/certificates" },
        { label: "보유 자격증 조회", to: "/self-development/owned" },
      ];
    case "statistics":
    default:
      return [
        { label: "기술 스택별 구성원", to: "/statistics/stack/member-count" },
        { label: "기술 스택별 평균 경력", to: "/statistics/stack/avg-career" },
        { label: "기간별 인기 기술 스택", to: "/statistics/stack/popular" },
        {
          label: "직무별 등록된 인원수",
          to: "/statistics/project/participation",
        },
        {
          label: "등급별 대기 상태 인원수",
          to: "/statistics/grade/waiting-count",
        },
        { label: "등급별 연봉 분포", to: "/statistics/grade/salary" },
        { label: "기술 스택 도입률 변화 추이", to: "/statistics/tech/trend" },
      ];
  }
});

// 현재 경로와 일치하는 항목에 highlighted 적용
const sidebarItems = computed(() =>
  rawItems.value.map((item) => ({
    ...item,
    highlighted: route.path === item.to,
  })),
);

// 사이드바 컴포넌트 선택
const sidebarComponent = computed(() => {
  switch (props.viewType) {
    case "adminSetting":
      return AdminSidebar;
    case "developerSelf":
      return DeveloperSidebar;
    case "statistics":
    default:
      return StatisticsSidebar;
  }
});
</script>
