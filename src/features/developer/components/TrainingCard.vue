<template>
  <div
    class="relative w-[230px] h-[290px] bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden"
  >
    <!-- 썸네일 이미지 -->
    <div class="relative w-full h-40">
      <img
        :src="thumbnailUrl"
        alt="교육 썸네일"
        class="w-full h-full object-cover"
      />

      <!-- 추천 사유 + 설명 오버레이 -->
      <div
        v-if="reason || description"
        class="absolute inset-0 bg-black bg-opacity-80 text-white text-xs p-4 opacity-0 hover:opacity-100 transition-opacity z-10 overflow-y-auto flex flex-col items-center justify-center text-center"
      >
        <p v-if="reason" class="mb-4 whitespace-pre-wrap font-semibold text-sm">
          {{ reason }}
        </p>
        <p v-if="description" class="whitespace-pre-wrap leading-snug text-xs">
          {{ description }}
        </p>
      </div>
    </div>

    <!-- 본문 -->
    <div
      class="p-4 flex flex-col justify-between h-[calc(100%-10rem)] text-center"
    >
      <div>
        <!-- 카테고리 -->
        <p
          v-if="trainingCategory"
          class="text-xs inline-block bg-gray-100 text-blue-600 font-semibold px-2 py-0.5 rounded-full mb-1"
        >
          {{ trainingCategory }}
        </p>

        <!-- 교육명 -->
        <h3 class="font-semibold text-sm truncate mb-0.5">{{ title }}</h3>

        <!-- 기관명 -->
        <p class="text-gray-500 text-xs truncate">{{ organization }}</p>
      </div>

      <!-- 수강하기 버튼 -->
      <a
        v-if="videoUrl"
        :href="videoUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-2 bg-blue-500 text-white w-full py-2 text-sm rounded hover:bg-blue-600 text-center"
      >
        수강하기
      </a>
    </div>
  </div>
</template>

<script setup>
const {
  title,
  description,
  reason,
  thumbnailUrl,
  trainingCategory,
  organization,
  videoUrl,
} = defineProps({
  title: String,
  description: String,
  reason: String,
  thumbnailUrl: String,
  trainingCategory: String,
  organization: String,
  videoUrl: String,
});
</script>
