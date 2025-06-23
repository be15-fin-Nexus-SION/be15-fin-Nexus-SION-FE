<template>
  <component :is="sidebarComponent" :items="sidebarItems" />
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import AdminSidebar from "./AdminSettingSidebar.vue";
import StatisticsSidebar from "./StatisticsSidebar.vue";

const props = defineProps({
  viewType: {
    type: String,
    required: true,
  },
});

const route = useRoute();

const rawItems = computed(() => {
  return props.viewType === "adminSetting"
    ? [
        { label: "회원 관리", to: "/admin/users" },
        { label: "프로젝트 승인", to: "/admin/projects" },
        { label: "기술 스택 관리", to: "/admin/tech-stack" },
        { label: "통계 보기", to: "/admin/statistics" },
        { label: "운영 로그", to: "/admin/logs" },
      ]
    : [
        { label: "기술 스택별 구성원", to: "/statistics/stack/member-count" },
        { label: "기술 스택별 평균 경력", to: "/statistics/stack/avg-career" },
        { label: "기간별 인기 기술 스택", to: "/statistics/total-score" },
        { label: "프로젝트 참여 직무별 구성원", to: "/statistics/unit-price" },
        { label: "등급별 대기 상태", to: "/statistics/education" },
        { label: "등급별 연봉 분포", to: "/statistics/certification" },
        { label: "기술 도입률 변화 추이", to: "/statistics/experience" },
      ];
});

const sidebarItems = computed(() =>
  rawItems.value.map((item) => ({
    ...item,
    highlighted: route.path === item.to,
  })),
);

const sidebarComponent = computed(() =>
  props.viewType === "adminSetting" ? AdminSidebar : StatisticsSidebar,
);
</script>
