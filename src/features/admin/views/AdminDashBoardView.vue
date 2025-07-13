<script setup>
import { ref, onMounted } from "vue";

import NotificationPanel from "../components/dashboard/NotificationPanel.vue";
import ProjectStatusPanel from "../components/dashboard/ProjectStatusPanel.vue";
import DeveloperRankingSlider from "../components/dashboard/DeveloperRankingSlider.vue";
import FreelancerTopList from "../components/dashboard/FreelancerTopList.vue";
import DeveloperAvailability from "../components/dashboard/DeveloperAvailability.vue";
import TechStackDemand from "../components/dashboard/TechStackDemand.vue";
import { getAdminMainDashboard } from "@/api/admin.js";
import { showErrorToast } from "@/utills/toast.js";

const dashboardData = ref(null);

onMounted(async () => {
  try {
    const res = await getAdminMainDashboard();
    dashboardData.value = res.data.data;
    console.log(dashboardData.value);
  } catch (error) {
    showErrorToast("대시보드 요약 정보 로딩에 실패했습니다");
  }
});
</script>

<template>
  <div class="admin-dashboard">
    <div class="dashboard-row">
      <NotificationPanel />
    </div>

    <div class="dashboard-row">
      <ProjectStatusPanel
        :pending-projects="dashboardData?.pendingProjects || []"
        :analyzing-projects="dashboardData?.analyzingProjects || []"
      />
    </div>

    <div class="dashboard-row">
      <DeveloperRankingSlider
        :top-developers="dashboardData?.topDevelopers || []"
      />
    </div>

    <div class="dashboard-row last-row">
      <FreelancerTopList :freelancers="dashboardData?.freelancerTop5 || []" />
      <DeveloperAvailability
        v-if="dashboardData?.developerAvailability"
        :availability="dashboardData.developerAvailability"
      />
      <TechStackDemand :stacks="dashboardData?.techStackDemand || []" />
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.dashboard-row {
  display: flex;
  gap: 30px;
}

.last-row {
  justify-content: space-between;
}

.last-row > * {
  flex: 1;
}
</style>
