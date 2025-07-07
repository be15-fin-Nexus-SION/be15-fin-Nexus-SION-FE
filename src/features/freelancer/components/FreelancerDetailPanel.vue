<template>
  <div class="w-[640px] space-y-4">
    <!-- 상단 타이틀 + 버튼 -->
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold">개인정보</h2>
      <div class="flex gap-2">
        <button class="px-4 py-2 bg-blue-500 text-white rounded">등록</button>
        <button class="px-4 py-2 bg-blue-500 text-white rounded">삭제</button>
      </div>
    </div>

    <div class="flex gap-4">
      <!-- 프로필 -->
      <div class="w-1/2 bg-white p-6 rounded-xl custom-shadow text-center">
        <img
          :src="freelancer.profileUrl"
          class="w-40 h-40 rounded-full object-cover mx-auto mb-4"
        />
        <div class="text-orange-500 font-bold text-xl">
          {{ freelancer.grade }}
        </div>
        <div class="text-lg font-medium mt-2">
          {{ freelancer.name }} {{ freelancer.isEmployee ? "사원" : "" }}
        </div>
      </div>

      <!-- 상세 정보 -->
      <div
        class="w-1/2 bg-white p-6 rounded-xl custom-shadow text-sm space-y-4"
      >
        <div>
          <div class="font-bold">사번</div>
          <div>{{ freelancer.code }}</div>
        </div>
        <div>
          <div class="font-bold">이력서</div>
          <a
            :href="freelancer.resumeLink"
            class="text-blue-500 underline"
            target="_blank"
          >
            이력서 보기
          </a>
        </div>
        <div>
          <div class="font-bold">연락처</div>
          <div>{{ freelancer.phone }} | {{ freelancer.email }}</div>
        </div>
        <div>
          <div class="font-bold">년차</div>
          <div>{{ freelancer.years }}</div>
        </div>
      </div>
    </div>

    <div
      class="text-center text-gray-400 mt-2 cursor-pointer"
      @click="$emit('close')"
    >
      닫기
    </div>
  </div>
</template>

<script setup>
defineProps({
  freelancer: Object,
});
defineEmits(["close"]);
</script>

<style>
.custom-shadow {
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.25);
}
</style>
