<template>
  <div>
    <!-- 타이틀 -->
    <h2 class="text-lg font-semibold mb-2">스쿼드 구성</h2>

    <!-- 필터 + 뷰 전환 버튼 -->
    <div class="flex justify-between items-center mb-4">
      <!-- 직무 필터 -->
      <div class="flex gap-2">
        <button
          v-for="type in jobTypes"
          :key="type"
          @click="selectedFilter = type"
          class="px-2 py-1 text-sm rounded-full transition border"
          :class="{
            'bg-filter-active text-black font-semibold':
              selectedFilter === type,
            'bg-filter text-black': selectedFilter !== type,
          }"
        >
          {{ type }}
        </button>
      </div>

      <!-- 뷰 전환 버튼 -->
      <div class="flex items-center gap-2">
        <button
          @click="viewMode = 'image'"
          class="w-6 h-6"
          :class="{
            'opacity-100': viewMode === 'image',
            'opacity-50': viewMode !== 'image',
          }"
        >
          <img src="/Squad_image_view.png" alt="이미지형" />
        </button>
        <button
          @click="viewMode = 'list'"
          class="w-6 h-6"
          :class="{
            'opacity-100': viewMode === 'list',
            'opacity-50': viewMode !== 'list',
          }"
        >
          <img src="/Squad_list_view.png" alt="리스트형" />
        </button>
      </div>
    </div>

    <!-- 카드 뷰 -->
    <div v-if="viewMode === 'image'" class="grid grid-cols-2 gap-4">
      <div
        v-for="member in filteredMembers"
        :key="member.name + member.job"
        class="relative flex flex-col items-center rounded-2xl p-[1px] bg-white shadow-md transition hover:scale-105 border-gradient"
      >
        <!-- 왕관 이미지 -->
        <button
          class="absolute top-2 left-2 w-6 h-6"
          @click="setLeader(member)"
        >
          <img
            :src="member.leader ? '/Crown_yellow.png' : '/Crown-gray.png'"
            alt="왕관"
            class="w-full h-full object-contain"
          />
        </button>

        <!-- 육각형 프로필 -->
        <div class="hex-border-wrapper">
          <div class="hex-border">
            <img
              :src="member.imageUrl || '/default-profile.png'"
              class="hex-image"
              alt="프로필 이미지"
            />
          </div>
        </div>

        <!-- 이름 / 직무 -->
        <p class="text-base font-semibold mt-1">{{ member.name }}</p>
        <p class="text-sm text-gray-500 mb-2">{{ member.job }}</p>
      </div>
    </div>

    <!-- 리스트 뷰 -->
    <div v-else class="space-y-2">
      <div
        v-for="member in filteredMembers"
        :key="member.name + member.job"
        class="border-gradient p-[1px] rounded-xl transition hover:scale-105"
      >
        <div
          class="flex items-center justify-between px-5 py-5 bg-white rounded-xl"
        >
          <div class="flex items-center gap-3">
            <img
              :src="member.imageUrl || '/default-profile.png'"
              class="w-10 h-10 rounded-full object-cover"
              alt="프로필"
            />
            <div>
              <p class="text-base font-semibold">{{ member.name }}</p>
              <p class="text-sm text-gray-500">{{ member.job }}</p>
            </div>
          </div>
          <button @click="setLeader(member)">
            <img
              :src="member.leader ? '/Crown_yellow.png' : '/Crown-gray.png'"
              class="w-5 h-5"
              alt="왕관"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  members: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:members"]);

const selectedFilter = ref("전체");
const jobTypes = ["전체", "프론트엔드", "백엔드", "서버/인프라"];
const viewMode = ref("image");

const filteredMembers = computed(() => {
  if (selectedFilter.value === "전체") return props.members;
  return props.members.filter((m) => m.job === selectedFilter.value);
});

const setLeader = (target) => {
  const updated = props.members.map((m) => ({
    ...m,
    leader: m === target ? !m.leader : false,
  }));
  emit("update:members", updated);
};
</script>

<style scoped>
.border-gradient {
  border: 0.25px solid transparent;
  border-radius: 0.75rem;
  background-image:
    linear-gradient(#fff, #fff),
    linear-gradient(90deg, #fe8686 0%, #1e268d 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
}

.hex-border-wrapper {
  width: 130px;
  height: 130px;
  padding: 8px;
  margin-top: 30px;
  background: linear-gradient(145deg, #929292, #f1f1f1);
  clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hex-border {
  width: 100%;
  height: 100%;
  background-color: white;
  clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hex-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%);
}
</style>
