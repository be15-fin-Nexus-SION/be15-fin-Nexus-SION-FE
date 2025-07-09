<template>
  <div class="space-y-4">
    <!-- 상세 테이블 -->
    <div>
      <h3 class="font-semibold mb-1">💸 비용 상세내역</h3>
      <table class="w-full text-sm border">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2 text-center">이름</th>
            <th class="border p-2 text-center">직무</th>
            <th class="border p-2 text-center">등급</th>
            <th class="border p-2 text-center">단가</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in details" :key="emp.memberId">
            <td class="border p-2 text-center">{{ emp.name }}</td>
            <td class="border p-2 text-center">{{ emp.job }}</td>
            <td class="border p-2 text-center">{{ emp.grade }}</td>
            <td class="border p-2 text-center">
              {{ formatCost(emp.monthlyUnitPrice) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  details: {
    type: Array,
    default: () => [],
  },
});

const formatCost = (cost) => {
  const n = Number(cost);
  if (!n || isNaN(n)) return "-";
  return `₩${n.toLocaleString()}`;
};
</script>
