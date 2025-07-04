<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import SquadCreateSection from "@/features/squad/components/create/SquadCreateSection.vue";
import SquadFilterSection from "@/features/squad/components/create/SquadFilterSection.vue";

// 라우터에서 projectId 추출
const route = useRoute();
const projectId = route.params.projectId;

// 선택된 멤버 관리
const selectedMembers = ref([
  {
    id: "EMP004",
    name: "박민수",
    grade: "S",
    monthlyUnitPrice: 3500000,
    productivity: 1.3,
    role: "백엔드",
  },
  {
    id: "EMP011",
    name: "자바스크립트개발자2",
    grade: "A",
    monthlyUnitPrice: 3500000,
    productivity: 1.1,
    role: "백엔드",
  },
  {
    id: "EMP013",
    name: "자바스크립트개발자2",
    grade: "A",
    monthlyUnitPrice: 3500000,
    productivity: 1.1,
    role: "백엔드",
  },
  {
    id: "EMP015",
    name: "자바스크립트개발자2",
    grade: "A",
    monthlyUnitPrice: 3500000,
    productivity: 1.1,
    role: "프론트엔드",
  },
  {
    id: "EMP016",
    name: "자바스크립트개발자2",
    grade: "A",
    monthlyUnitPrice: 2500000,
    productivity: 1.1,
    role: "프론트엔드",
  },
  {
    id: "EMP017",
    name: "자바스크립트개발자2",
    grade: "A",
    monthlyUnitPrice: 2500000,
    productivity: 1.1,
    role: "프론트엔드",
  },
]);

function handleAdd(member) {
  selectedMembers.value.push(member);
}

function handleRemove(memberId) {
  selectedMembers.value = selectedMembers.value.filter(
    (m) => m.id !== memberId,
  );
}

// 프로젝트 상세 정보
const budgetLimit = ref(0);
const estimatedCost = ref(0);
const totalEffort = ref(0);
const jobRequirements = ref([]);
const durationLimit = ref(0);
const estimatedDuration = ref(0);

// API로 프로젝트 분석 데이터 호출 (예시)
async function fetchProjectDetail() {
  // 실제 API 호출로 변경 필요
  const response = {
    success: true,
    data: {
      projectCode: "ha_1_1",
      budgetLimit: 130000000,
      durationLimit: 6.5333,
      estimatedDuration: 9.0,
      estimatedCost: 156250000,
      jobRequirements: [
        {
          jobName: "백엔드",
          requiredCount: 2,
        },
        {
          jobName: "프론트엔드",
          requiredCount: 3,
        },
      ],
      totalEffort: 31.25,
    },
  };

  const data = response.data;
  budgetLimit.value = data.budgetLimit;
  estimatedCost.value = data.estimatedCost;
  totalEffort.value = data.totalEffort;
  jobRequirements.value = data.jobRequirements;
  durationLimit.value = data.durationLimit;
  estimatedDuration.value = data.estimatedDuration;
}

// 컴포넌트 마운트 시 데이터 불러오기
onMounted(() => {
  fetchProjectDetail();
});
</script>

<template>
  <section class="squad-create-container">
    <div class="layout">
      <!-- 좌측: 스쿼드 구성 패널 -->
      <SquadCreateSection
        :members="selectedMembers"
        :budget-limit="budgetLimit"
        :estimated-cost="estimatedCost"
        :total-effort="totalEffort"
        :job-requirements="jobRequirements"
        :duration-limit="durationLimit"
        :estimated-duration="estimatedDuration"
        @remove="handleRemove"
        @submit="() => console.log('등록 실행')"
      />

      <!-- 우측: 개발자 조회 패널 -->
      <div class="flex-1">
        <SquadFilterSection />
      </div>
    </div>
  </section>
</template>

<style scoped>
.squad-create-container {
  @apply w-full py-10;
}
.layout {
  @apply flex gap-6;
}
</style>
