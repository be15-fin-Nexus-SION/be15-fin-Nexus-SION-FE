<template>
  <div class="max-w-7xl mx-auto py-10 px-4 space-y-8">
    <!-- 상단 버튼 -->
    <div class="flex items-center justify-between">
      <div class="text-xl font-semibold">개발자 상세</div>
      <div class="space-x-2">
        <button
            class="px-4 py-2 rounded-md bg-primary text-white text-sm"
            @click="goToEdit"
        >
          수정
        </button>
        <button
            class="px-4 py-2 rounded-md bg-gray-200 text-sm"
            @click="showDeleteConfirm = true"
        >
          삭제
        </button>
      </div>
    </div>

    <!-- 개인 정보 카드 -->
    <section
        v-if="developer"
        class="relative bg-white p-10 rounded-xl shadow flex gap-20 items-start"
    >
      <div class="absolute top-6 right-6">
        <span
            :class="[
            'px-4 py-1 rounded-full text-sm font-semibold',
            developer.status === 'IN_PROJECT'
              ? 'bg-green-100 text-green-700'
              : developer.status === 'AVAILABLE'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-600'
          ]"
        >
          {{ statusLabel(developer.status) }}
        </span>
      </div>

      <div class="w-48 flex flex-col items-center">
        <img
            :src="developer.profileImageUrl"
            alt="프로필 이미지"
            class="w-48 h-48 rounded-full object-cover border mb-4"
        />
        <div class="text-center">
          <div class="text-lg font-bold text-gray-900">{{ developer.name }}</div>
          <div class="text-sm font-semibold text-gray-500 mt-1">{{ developer.grade || '-' }}</div>
        </div>
      </div>

      <div class="flex-1 space-y-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-2">사원 정보</h3>
        <div class="border-b pb-4">
          <dl class="grid grid-cols-4 gap-y-3 text-sm text-gray-800">
            <dt class="font-semibold text-gray-500">사번</dt>
            <dd class="col-span-3">{{ developer.employeeId }}</dd>

            <dt class="font-semibold text-gray-500">직급</dt>
            <dd class="col-span-3">{{ developer.position || '-' }}</dd>

            <dt class="font-semibold text-gray-500">부서</dt>
            <dd class="col-span-3">{{ developer.department || '-' }}</dd>

            <dt class="font-semibold text-gray-500">생년월일</dt>
            <dd class="col-span-3">{{ developer.birthday || '-' }}</dd>

            <dt class="font-semibold text-gray-500">이메일</dt>
            <dd class="col-span-3">{{ developer.email }}</dd>

            <dt class="font-semibold text-gray-500">근무 기간</dt>
            <dd class="col-span-3">{{ developer.joinedAt }} ~ 진행중</dd>

            <dt class="font-semibold text-gray-500">연락처</dt>
            <dd class="col-span-3">{{ developer.phoneNumber }} | {{ developer.email }}</dd>

            <dt class="font-semibold text-gray-500">년차</dt>
            <dd class="col-span-3">{{ developer.careerYears }}년차</dd>
          </dl>
        </div>

        <h3 class="text-sm font-semibold text-gray-700 mb-2">기술 스택</h3>
        <div>
          <div class="flex flex-wrap gap-1.5">
            <TechBadge
                v-for="tech in techList"
                :key="tech"
                :label="tech"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-2 gap-6">
      <div class="bg-white p-4 rounded-xl shadow">
        <div class="font-semibold mb-4">이력 관리</div>
        <div class="flex gap-4 text-sm mb-2">
          <span class="font-semibold text-primary">프로젝트 이력</span>
          <span class="text-gray-400">자격증</span>
          <span class="text-gray-400">교육 이력</span>
        </div>
        <div class="h-40 flex items-center justify-center">
          <p class="text-gray-400 text-sm">프로젝트 이력이 없습니다.</p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl shadow">
        <div class="font-semibold mb-4">주요 기술 스택</div>
        <RadarChart v-if="radarData" :data="radarData" />
      </div>
    </section>

    <section class="bg-white p-4 rounded-xl shadow">
      <div class="font-semibold mb-4">기술 스택별 점수</div>
      <BarChart v-if="barData" :data="barData" />
    </section>

    <!-- 삭제 확인 모달 -->
    <ConfirmModal
        v-if="showDeleteConfirm"
        message="정말 삭제하시겠습니까?"
        confirmText="확인"
        @confirm="deleteDeveloperHandler"
        @close="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BarChart from '@/features/developer/components/BarChart.vue';
import RadarChart from '@/features/developer/components/RadarChart.vue';
import { fetchDeveloperDetail, fetchTechStacksByEmployeeId, deleteDeveloper } from '@/api/member';
import TechBadge from '@/components/badge/TechBadge.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';

const route = useRoute();
const router = useRouter();
const employeeId = route.params.employeeId;

const developer = ref(null);
const techList = ref([]);
const barData = ref(null);
const radarData = ref(null);
const showDeleteConfirm = ref(false);

const statusLabel = (status) => {
  switch (status) {
    case 'AVAILABLE': return '대기중';
    case 'IN_PROJECT': return '투입중';
    case 'UNAVAILABLE': return '비활성';
    default: return status;
  }
};

function goToEdit() {
  router.push({ name: 'developer-edit', params: { employeeId } });
}

async function deleteDeveloperHandler() {
  try {
    await deleteDeveloper(employeeId);
    alert('삭제가 완료되었습니다.');
    router.push({ name: 'developer-list' });
  } catch (e) {
    alert('삭제에 실패했습니다.');
    console.error('삭제 오류:', e);
  } finally {
    showDeleteConfirm.value = false;
  }
}

onMounted(async () => {
  try {
    const { data: devRes } = await fetchDeveloperDetail(employeeId);
    developer.value = devRes.data;

    const { data: stackRes } = await fetchTechStacksByEmployeeId(employeeId);
    const stackData = stackRes.data;

    techList.value = stackData.map((s) => s.techStackName);
    barData.value = stackData;

    const top7 = [...stackData].sort((a, b) => b.score - a.score).slice(0, 7);
    radarData.value = {
      labels: top7.map((s) => s.techStackName),
      datasets: [
        {
          label: '기술 점수',
          data: top7.map((s) => s.score),
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    };
  } catch (e) {
    console.error('개발자 상세 정보 불러오기 실패', e);
  }
});
</script>

<style scoped>
th,
td {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
</style>