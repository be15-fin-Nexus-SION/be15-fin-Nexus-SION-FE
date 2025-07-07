<script setup>
import { ref, computed, watchEffect, onMounted, onUnmounted } from "vue";
import { useSquadStore } from "@/stores/squadCreateStore.js";
import SquadMemberRenderer from "@/features/squad/components/presentation/SquadMemberRenderer.vue";

const viewMode = ref("card");
const isMobile = ref(false);
const roleFilter = ref("전체");

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

const availableRoles = computed(() => {
  const roles = squadStore.selectedMembers.map((m) => m.role);
  return ["전체", ...new Set(roles)];
});

function removeMember(memberId) {
  squadStore.removeMember(memberId);
}

function setLeader(member) {
  squadStore.selectedMembers = squadStore.selectedMembers.map((m) => ({
    ...m,
    isLeader: m.id === member.id,
  }));
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

<style scoped>
.squad-card-list-wrapper {
  @apply w-full p-4 bg-white;
}

.btn-register {
  @apply px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover;
}

.filter-select {
  @apply px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100;
}

.icon-btn {
  @apply px-3 py-1 text-sm border rounded hover:bg-gray-100;
}

.icon-btn.active {
  @apply bg-primary text-white border-primary;
}

.card-grid {
  @apply grid grid-cols-2 gap-4;
}

.member-card {
  @apply relative rounded-lg p-4 shadow-sm bg-white;
}

.member-card:hover {
  @apply shadow-lg;
  transform: translateY(-2px) scale(1.02);
}

.border-gradient {
  border: 2px solid transparent;
  background-origin: border-box;
  background-clip: padding-box, border-box;
  background-image:
    linear-gradient(white, white),
    linear-gradient(120deg, #fe8686, #1268dd, #fe8686);
  background-size:
    100% 100%,
    500% 500%;
  background-position:
    center,
    0% 50%;
  animation: gradientBorderFlow 6s ease infinite;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

@keyframes gradientBorderFlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.hexagon-frame {
  position: relative;
  width: 200px;
  height: 220px;
  background: linear-gradient(
    145deg,
    #f0f0f0 0%,
    #d9d9d9 25%,
    #b0b0b0 50%,
    #d9d9d9 75%,
    #f0f0f0 100%
  );
  clip-path: polygon(
    25% 6.7%,
    75% 6.7%,
    100% 50%,
    75% 93.3%,
    25% 93.3%,
    0% 50%
  );
  overflow: hidden;
}

.hexagon-image {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 90%;
  height: 90%;
  object-fit: cover;
  transform: translate(-50%, -50%);
  clip-path: inherit;
  @apply bg-red-50;
}

.info {
  @apply text-center;
}

.name {
  @apply font-bold text-lg;
}

.role {
  @apply text-sm text-gray-500;
}

.btn-remove {
  @apply absolute text-gray-400 hover:text-red-500 text-xl font-extrabold;
}

.list-view {
  @apply flex flex-col gap-2;
}

.list-item {
  @apply border rounded px-4 py-3;
}

.avatar-sm {
  @apply w-12 h-12 rounded-full object-cover;
}

.list-item {
  @apply border rounded px-4 py-3 bg-white transition-all duration-200;
  background-origin: border-box;
  background-clip: padding-box, border-box;
  background-image:
    linear-gradient(white, white), theme("backgroundImage.gradient-card");
  background-size:
    100% 100%,
    300% 300%;
  background-position:
    center,
    0% 50%;
  animation: gradientBorderFlow 6s ease infinite;
  border: 2px solid transparent;
  border-radius: 0.5rem;
}

.list-item:hover {
  @apply shadow-lg;
  transform: translateY(-2px) scale(1.02);
}

.grade-text {
  @apply font-bold text-2xl text-transparent bg-clip-text;
  min-width: 2rem;
  text-align: center;
}

@keyframes crownPulse {
  0% {
    transform: scale(1) rotate(0deg);
    filter: drop-shadow(0 0 0px gold);
  }
  50% {
    transform: scale(1.2) rotate(10deg);
    filter: drop-shadow(0 0 10px gold);
  }
  100% {
    transform: scale(1) rotate(0deg);
    filter: drop-shadow(0 0 0px gold);
  }
}

.animated-crown {
  animation: crownPulse 0.6s ease-out;
}

.text-gradient-grade-s {
  background-image: linear-gradient(90deg, #ff8c00, #992e00);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.text-gradient-grade-a {
  background-image: linear-gradient(90deg, #ff000d, #990000);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.text-gradient-grade-b {
  background-image: linear-gradient(90deg, #00ffa6, #009966);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.text-gradient-grade-c {
  background-image: linear-gradient(90deg, #ffe500, #999600);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.text-gradient-grade-d {
  background-image: linear-gradient(90deg, #bdbdbd, #606060);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
</style>
