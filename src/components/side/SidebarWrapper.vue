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
        {
          label: "스택별 구성원 수 조회",
          to: "/statistics/stack/member-count",
        },
        { label: "스택별 등급 분포", to: "/statistics/stack/grades" },
        { label: "등급별 단가 비교", to: "/statistics/unit-price" },
        { label: "교육 이수 현황", to: "/statistics/education" },
        { label: "자격증 보유 현황", to: "/statistics/certification" },
        { label: "연차별 성과 비교", to: "/statistics/experience" },
        { label: "기술별 점수 합계", to: "/statistics/total-score" },
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
