<script setup>
import { ref, watchEffect, onMounted, onUnmounted } from "vue";
import { useSquadStore } from "@/stores/squadCreateStore.js";
import SquadMemberRenderer from "@/features/squad/components/presentation/SquadMemberRenderer.vue";

const viewMode = ref("card");
const isMobile = ref(false);

const squadStore = useSquadStore();

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 800;
};

onMounted(() => {
  updateIsMobile();
  window.addEventListener("resize", updateIsMobile);
});
onUnmounted(() => {
  window.removeEventListener("resize", updateIsMobile);
});

watchEffect(() => {
  if (isMobile.value) viewMode.value = "list";
});

function removeMember(memberId) {
  squadStore.removeMember(memberId);
}
</script>

<template>
  <SquadMemberRenderer
    title="스쿼드 구성"
    :members="squadStore.selectedMembers"
    :readonly="false"
    @remove="removeMember"
    @set-leader="squadStore.setLeader"
  />
</template>
