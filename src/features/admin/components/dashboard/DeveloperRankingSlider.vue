<script setup>
import { ref } from "vue";

// ✅ props로 상위 개발자 리스트를 전달받음
const props = defineProps({
  topDevelopers: {
    type: Array,
    required: true,
  },
});

const scrollRef = ref(null);

const scrollLeft = () => {
  scrollRef.value.scrollBy({ left: -300, behavior: "smooth" });
};

const scrollRight = () => {
  scrollRef.value.scrollBy({ left: 300, behavior: "smooth" });
};
</script>

<template>
  <div class="relative w-full">
    <h2 class="text-lg font-bold text-gray-800 mb-4">🏆 TOP 10 개발자</h2>

    <!-- 슬라이더 영역 -->
    <div class="relative overflow-hidden">
      <div
        ref="scrollRef"
        class="flex gap-4 overflow-x-auto pb-2 scroll-smooth no-scrollbar"
      >
        <div
          v-for="dev in props.topDevelopers"
          :key="dev.id"
          class="flex-shrink-0 w-[220px] bg-white shadow-md rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-all"
        >
          <div class="flex flex-col items-center text-center">
            <img
              :src="
                dev.profileUrl ||
                `https://api.dicebear.com/9.x/notionists/svg?seed=` + dev.id
              "
              alt="Profile"
              class="w-20 h-20 rounded-full object-cover mb-3 border-2 border-primary"
            />
            <h3 class="font-semibold text-gray-800 text-base mb-1">
              {{ dev.name }}
            </h3>
            <span
              class="text-sm font-medium text-white px-2 py-0.5 rounded-full mb-2"
              :class="{
                'bg-yellow-500': dev.grade === 'S',
                'bg-blue-500': dev.grade === 'A',
                'bg-green-500': dev.grade === 'B',
                'bg-gray-500': dev.grade === 'C' || dev.grade === 'D',
              }"
            >
              {{ dev.grade }} 등급
            </span>
            <p class="text-xs text-gray-500 mb-2">
              <span class="font-bold">{{
                Number(dev.productivity).toFixed(1)
              }}</span>
              점
            </p>
            <div class="flex flex-wrap justify-center items-center gap-2 mt-2">
              <span
                v-for="stack in dev.techStacks.slice(0, 3)"
                :key="stack"
                class="text-[11px] font-medium text-white bg-support-stack px-2 py-0.5 rounded-full"
              >
                {{ stack }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 좌우 버튼 -->
      <button
        @click="scrollLeft"
        class="absolute top-1/2 -translate-y-1/2 left-0 z-10 bg-white shadow p-2 rounded-full hover:bg-gray-100"
      >
        ◀
      </button>
      <button
        @click="scrollRight"
        class="absolute top-1/2 -translate-y-1/2 right-0 z-10 bg-white shadow p-2 rounded-full hover:bg-gray-100"
      >
        ▶
      </button>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
