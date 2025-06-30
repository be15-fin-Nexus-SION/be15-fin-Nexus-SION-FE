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
        { label: "기술 스택 설정", to: "/admin/users" },
        { label: "도메인 설정", to: "/admin/domains" },
        { label: "고객사 설정", to: "/admin/tech-stack" },
        { label: "직무 설정", to: "/admin/jobs" },
        { label: "구간별 단가 설정", to: "/admin/logs" },
        { label: "초기 스택 점수 설정", to: "/admin/logs" },
      ]
    : [
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
