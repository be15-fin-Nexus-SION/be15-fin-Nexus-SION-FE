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

function setLeader(member) {
  squadStore.selectedMembers.value = squadStore.selectedMembers.value.map(
    (m) => ({
      ...m,
      isLeader: m.id === member.id,
    }),
  );
}
</script>

<template>
  <SquadMemberRenderer
    title="스쿼드 구성"
    :members="squadStore.selectedMembers"
    :readonly="false"
    @remove="removeMember"
    @set-leader="setLeader"
  />
</template>
