<script setup>
import { ref, computed, watchEffect, onMounted, onUnmounted } from "vue";
import CrownFilled from "@/assets/icons/Crown_filled.svg";
import CrownUnfilled from "@/assets/icons/Crown_Unfilled.svg";
import { useDeveloperModal } from "@/composable/useDeveloperModal.js";

const props = defineProps({
  title: {
    type: String,
    default: "스쿼드 구성",
  },
  members: {
    type: Array,
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["remove", "set-leader"]);

const isMobile = ref(false);
const viewMode = ref("card");
const roleFilter = ref("전체");

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
  const roles = props.members.map((m) => m.role || m.job);
  return ["전체", ...new Set(roles)];
});

const filteredMembers = computed(() => {
  if (roleFilter.value === "전체") return props.members;
  return props.members.filter((m) => (m.role || m.job) === roleFilter.value);
});

const { openModal } = useDeveloperModal();
</script>

<template>
  <section class="squad-card-list-wrapper">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-extrabold">{{ title }}</h2>
    </div>

    <div class="flex justify-between items-center mb-4">
      <select class="filter-select" v-model="roleFilter">
        <option v-for="role in availableRoles" :key="role" :value="role">
          {{ role }}
        </option>
      </select>

      <div v-if="!isMobile" class="flex gap-2">
        <button
          class="icon-btn"
          :class="{ active: viewMode === 'card' }"
          @click="viewMode = 'card'"
        >
          <i class="fa-solid fa-image"></i>
        </button>
        <button
          class="icon-btn"
          :class="{ active: viewMode === 'list' }"
          @click="viewMode = 'list'"
        >
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>
    </div>

    <!-- 카드 뷰 -->
    <div v-if="viewMode === 'card'" class="card-grid">
      <template v-if="filteredMembers.length">
        <article
          v-for="member in filteredMembers"
          :key="member.id"
          class="member-card border-gradient"
        >
          <div
            class="relative group w-full flex flex-col items-center h-[220px]"
          >
            <div
              class="hexagon-frame cursor-pointer"
              @click="openModal(member.id)"
            >
              <img
                :src="
                  member.imageUrl ||
                  `https://api.dicebear.com/9.x/notionists/svg?seed=` +
                    member.id
                "
                alt="profile"
                class="hexagon-image"
              />
            </div>
            <div class="flex-1 info flex flex-col justify-end">
              <p class="name">{{ member.name }}</p>
              <p class="role">{{ member.role || member.job }}</p>
            </div>

            <!-- 리더 버튼 -->
            <button
              v-if="member.isLeader || member.leader || !readonly"
              class="btn-leader absolute top-0 left-0 text-yellow-500"
              @click.stop="!readonly && $emit('set-leader', member)"
              :disabled="readonly"
              :class="[{ 'animated-crown': member.isLeader || member.leader }]"
              :title="
                member.isLeader || member.leader
                  ? '현재 리더'
                  : readonly
                    ? '리더 지정 불가'
                    : '리더로 지정'
              "
            >
              <img
                :src="
                  member.isLeader || member.leader ? CrownFilled : CrownUnfilled
                "
                alt="리더 아이콘"
              />
            </button>

            <!-- 삭제 버튼 -->
            <button
              v-if="!readonly"
              class="btn-remove transition-opacity duration-200 opacity-0 group-hover:opacity-100 -top-1 right-0"
              @click.stop="$emit('remove', member.id)"
            >
              ✕
            </button>
          </div>
        </article>
      </template>
      <div
        v-else
        class="flex flex-col items-center justify-center w-full col-span-2 py-12 text-gray-500 animate-pulse bg-gray-50 rounded-xl border border-dashed border-gray-300"
      >
        <i class="fa-solid fa-users text-4xl mb-4 text-primary"></i>
        <p class="text-lg font-medium">
          프로젝트에 투입될 인재들을 선택해주세요
        </p>
      </div>
    </div>

    <!-- 리스트 뷰 -->
    <ul v-else class="list-view">
      <template v-if="filteredMembers.length">
        <li
          v-for="member in filteredMembers"
          :key="member.id"
          class="list-item border-gradient group"
          @click="openModal(member.id)"
        >
          <div class="flex items-center gap-4 justify-between">
            <div class="flex items-center gap-4">
              <img
                :src="
                  member.imageUrl ||
                  `https://api.dicebear.com/9.x/notionists/svg?seed=` +
                    member.id
                "
                alt="avatar"
                class="avatar-sm bg-gray-100"
              />
              <div class="flex flex-col">
                <p class="name">{{ member.name }}</p>
                <p class="role text-sm text-gray-500">
                  {{ member.role || member.job }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <span
                class="grade-text"
                :class="`text-gradient-grade-${member.grade?.toLowerCase?.()}`"
              >
                {{ member.grade }}
              </span>

              <!-- 리더 버튼 -->
              <button
                v-if="member.isLeader || member.leader || !readonly"
                class="btn-leader text-yellow-500"
                :disabled="readonly"
                @click.stop="$emit('set-leader', member)"
                :class="{ 'animated-crown': member.isLeader || member.leader }"
                :title="
                  member.isLeader || member.leader ? '현재 리더' : '리더로 지정'
                "
              >
                <img
                  :src="
                    member.isLeader || member.leader
                      ? CrownFilled
                      : CrownUnfilled
                  "
                  alt="리더 아이콘"
                />
              </button>

              <!-- 삭제 버튼 -->
              <button
                v-if="!readonly"
                class="btn-remove transition-opacity duration-200 opacity-0 group-hover:opacity-100 top-0 right-2"
                @click.stop="$emit('remove', member.id)"
              >
                ✕
              </button>
            </div>
          </div>
        </li>
      </template>
      <li
        v-else
        class="animate-pulse w-full text-center py-10 text-gray-500 animate-fadeIn border border-dashed border-gray-300 rounded-lg"
      >
        <i class="fa-solid fa-users text-3xl mb-3 text-primary"></i><br />
        <span class="text-base font-medium"
          >스쿼드 구성원이 아직 없습니다.</span
        >
      </li>
    </ul>
  </section>
</template>

<style scoped>
.squad-card-list-wrapper {
  @apply w-full p-6 shadow rounded-xl bg-white;
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
  width: 180px;
  height: 200px;
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
  @apply bg-white;
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
