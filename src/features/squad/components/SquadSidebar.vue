<template>
  <aside class="w-64 h-screen bg-gray-100 p-4 border-r overflow-y-auto">
    <!-- 진행 전 프로젝트 관리 -->
    <div class="mb-4">
      <SquadSidebarSection
        title="진행 전 프로젝트 관리"
        :items="projectGroups.waiting.slice(0, 3)"
        :active="selectedProjectCode"
        :projectMap="projectMap"
        @select="onSelect"
      />
      <button
        v-if="projectGroups.waiting.length > 3"
        class="text-blue-500 text-sm mt-1 ml-2"
        @click="onMore('waiting')"
      >
        + 더보기
      </button>
    </div>

    <!-- 진행중 프로젝트 관리 -->
    <div class="mb-4">
      <SquadSidebarSection
        title="진행중 프로젝트 관리"
        :items="projectGroups.inprogress.slice(0, 3)"
        :active="selectedProjectCode"
        :projectMap="projectMap"
        @select="onSelect"
      />
      <button
        v-if="projectGroups.inprogress.length > 3"
        class="text-blue-500 text-sm mt-1 ml-2"
        @click="onMore('inprogress')"
      >
        + 더보기
      </button>
    </div>

    <!-- 완료 프로젝트 관리 -->
    <div class="mb-4">
      <SquadSidebarSection
        title="완료 프로젝트 관리"
        :items="projectGroups.complete.slice(0, 3)"
        :active="selectedProjectCode"
        :projectMap="projectMap"
        @select="onSelect"
      />
      <button
        v-if="projectGroups.complete.length > 3"
        class="text-blue-500 text-sm mt-1 ml-2"
        @click="onMore('complete')"
      >
        + 더보기
      </button>
    </div>

    <!-- 프로젝트 추가 버튼 -->
    <button class="w-full mt-6 bg-indigo-600 text-white py-2 rounded">
      + 프로젝트 추가
    </button>
  </aside>
</template>

<script setup>
import { onMounted } from "vue";
import SquadSidebarSection from "./SquadSidebarSection.vue";

const props = defineProps({
  projectGroups: Object,
  selectedProjectCode: String,
  projectMap: Object,
});

const emit = defineEmits(["select", "more"]);

const onSelect = (code) => emit("select", code);
const onMore = (type) => emit("more", type);

onMounted(() => {
  console.log("✅ props.projectGroups:", props.projectGroups);
  console.log("✅ 진행중 length:", props.projectGroups?.inprogress?.length);
  console.log("✅ projectGroups.waiting:", props.projectGroups?.waiting);
  console.log("✅ projectMap:", props.projectMap);
});
</script>
