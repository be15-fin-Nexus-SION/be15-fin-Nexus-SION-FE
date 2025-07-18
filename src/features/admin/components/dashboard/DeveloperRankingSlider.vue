<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  topDevelopers: {
    type: Array,
    required: true,
  },
});

const router = useRouter();
function handleViewDeveloperDetail(developerId) {
  router.push(`/developers/${developerId}`);
}

const scrollRef = ref(null);
let animationFrameId = null;
const scrollSpeed = 0.5;

// ✅ 리스트 3배 복제
const loopedDevelopers = computed(() => [
  ...props.topDevelopers,
  ...props.topDevelopers,
  ...props.topDevelopers,
]);

const scrollToMiddle = () => {
  if (!scrollRef.value) return;
  scrollRef.value.scrollLeft = scrollRef.value.scrollWidth / 3;
};
const autoScroll = () => {
  const el = scrollRef.value;
  if (!el) return;

  el.scrollLeft += scrollSpeed;

  const oneBlockWidth = el.scrollWidth / 3;
  const maxScroll = oneBlockWidth * 2;

  // 👉 오른쪽 끝 → 중간으로 순간 이동
  if (el.scrollLeft >= maxScroll) {
    el.style.scrollBehavior = "auto"; // ✅ 부드러운 스크롤 끄기
    el.scrollLeft -= oneBlockWidth;
    el.style.scrollBehavior = "smooth"; // ✅ 다시 원래대로 복원
  }

  // 👉 왼쪽 끝 → 중간으로 순간 이동
  if (el.scrollLeft <= 0) {
    el.style.scrollBehavior = "auto";
    el.scrollLeft += oneBlockWidth;
    el.style.scrollBehavior = "smooth";
  }

  animationFrameId = requestAnimationFrame(autoScroll);
};

const startAutoScroll = () => {
  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(autoScroll);
  }
};

const stopAutoScroll = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

const scrollByDistance = (distance) => {
  stopAutoScroll();
  const el = scrollRef.value;
  if (!el) return;

  const oneBlockWidth = el.scrollWidth / 3;

  // 👉 왼쪽 블록 끝에 도달 시 → 중간 블록으로 순간 이동
  if (el.scrollLeft <= oneBlockWidth * 0.2) {
    el.scrollLeft += oneBlockWidth;
  }

  // 👉 오른쪽 블록 끝 도달 시 → 중간 블록으로 순간 이동
  if (el.scrollLeft >= oneBlockWidth * 2.8) {
    el.scrollLeft -= oneBlockWidth;
  }

  el.scrollBy({ left: distance, behavior: "smooth" });

  setTimeout(() => {
    startAutoScroll();
  }, 2000);
};

const scrollLeft = () => scrollByDistance(-300);
const scrollRight = () => scrollByDistance(300);

onMounted(async () => {
  await nextTick();
  await new Promise((r) => setTimeout(r, 50)); // layout 안정화
  scrollToMiddle();
  startAutoScroll();
});

onUnmounted(() => {
  stopAutoScroll();
});
</script>
<template>
  <div class="relative w-full">
    <h2 class="text-lg font-bold text-gray-800 mb-4">🏆 TOP 10 개발자</h2>

    <!-- 슬라이더 영역 -->
    <div class="relative overflow-hidden">
      <div
        ref="scrollRef"
        class="mx-12 flex gap-4 overflow-x-auto pb-2 scroll-smooth no-scrollbar"
        @mouseenter="stopAutoScroll"
        @mouseleave="startAutoScroll"
      >
        <div
          v-for="(dev, idx) in loopedDevelopers"
          :key="`${dev.id}-${idx}`"
          class="flex-shrink-0 w-[220px] bg-white shadow-md rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
          @click="handleViewDeveloperDetail(dev.id)"
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
                'bg-black': dev.grade === null,
              }"
            >
              {{ dev.grade === null ? "미정" : dev.grade }} 등급
            </span>
            <p class="text-xs text-gray-500 mb-2">
              <span class="font-bold">{{ Number(dev.totalScores) }}</span> 점
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
