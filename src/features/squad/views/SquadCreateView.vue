<script setup>
import SquadCreateSection from "@/features/squad/components/create/SquadCreateSection.vue";
import SquadFilterSection from "@/features/squad/components/create/SquadFilterSection.vue";
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import { handleSquadSelect } from "@/composable/useSquadSelect.js";

const route = useRoute();

onMounted(async () => {
  const squadCode = route.query.squadCode;
  if (squadCode) {
    await handleSquadSelect(squadCode);
  }
});
</script>

<template>
  <section class="squad-create-container">
    <div class="layout">
      <!-- 좌측: 스쿼드 구성 패널 -->
      <SquadCreateSection />

      <!-- 우측: 개발자 조회 패널 -->
      <div class="flex-1">
        <SquadFilterSection />
      </div>
    </div>
  </section>
</template>

<style scoped>
.squad-create-container {
  @apply w-full py-10;
}
.layout {
  @apply flex gap-6;
}
</style>
