<script setup>
import SquadCreateSection from "@/features/squad/components/create/SquadCreateSection.vue";
import SquadFilterSection from "@/features/squad/components/create/SquadFilterSection.vue";
</script>

<template>
  <section class="squad-create-container">
    <div class="layout">
      <SquadCreateSection />

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
