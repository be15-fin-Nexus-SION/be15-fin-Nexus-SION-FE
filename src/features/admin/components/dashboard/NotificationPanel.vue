<script setup>
import { ref } from "vue";

const myNotifications = ref([
  {
    id: 1,
    title: "새 프로젝트가 배정되었습니다",
    content: "‘AI 분석 시스템 고도화’에 배정됨",
    time: "2시간 전",
  },
  {
    id: 2,
    title: "스쿼드 구성이 완료되었습니다",
    content: "‘빅데이터 구축 사업’ 스쿼드 확정",
    time: "어제",
  },
]);

const allNotifications = ref([
  {
    id: 1,
    title: "서버 점검 예정",
    content: "이번 주 토요일 오전 2시~4시 정기 점검",
    time: "1일 전",
  },
  {
    id: 2,
    title: "신규 프리랜서 등록",
    content: "홍길동 프리랜서 등록됨",
    time: "3일 전",
  },
]);
</script>

<template>
  <div class="flex gap-8 w-full">
    <!-- 내 알림 -->
    <div
      class="flex-1 p-6 rounded-xl shadow-lg transition-all bg-gradient-to-br from-[#e3f2fd] to-[#f0f8ff] border border-[#bbdefb]"
    >
      <h3 class="text-[18px] font-bold mb-5 text-[#333]">📥 내 알림</h3>
      <ul class="space-y-4">
        <li
          v-for="item in myNotifications"
          :key="item.id"
          class="bg-white/90 rounded-lg px-5 py-4 border-l-4 border-[#90caf9] shadow-sm hover:-translate-y-0.5 hover:bg-[#f4f6f8] transition-all"
        >
          <div class="font-semibold text-[15px] mb-1 text-[#222]">
            {{ item.title }}
          </div>
          <div class="text-[14px] text-[#555] mb-1">
            {{ item.content }}
          </div>
          <div class="text-[12px] text-[#999] text-right">
            {{ item.time }}
          </div>
        </li>
      </ul>
    </div>

    <!-- 전체 알림 -->
    <div
      class="flex-1 p-6 rounded-xl shadow-lg transition-all bg-gradient-to-br from-[#f3e5f5] to-[#f8f4fc] border border-[#ce93d8]"
    >
      <h3 class="text-[18px] font-bold mb-5 text-[#333]">📢 전체 알림</h3>
      <ul class="space-y-4">
        <li
          v-for="item in allNotifications"
          :key="item.id"
          class="bg-white/90 rounded-lg px-5 py-4 border-l-4 border-[#ba68c8] shadow-sm hover:-translate-y-0.5 hover:bg-[#f4f6f8] transition-all"
        >
          <div class="font-semibold text-[15px] mb-1 text-[#222]">
            {{ item.title }}
          </div>
          <div class="text-[14px] text-[#555] mb-1">
            {{ item.content }}
          </div>
          <div class="text-[12px] text-[#999] text-right">
            {{ item.time }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
