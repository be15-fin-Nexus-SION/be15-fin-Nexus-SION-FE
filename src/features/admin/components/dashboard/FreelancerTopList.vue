<script setup>
// ✅ props로 프리랜서 리스트를 전달받음
const props = defineProps({
  freelancers: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div
    class="p-6 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col"
  >
    <h2 class="text-lg font-bold text-gray-800 mb-4">👨‍💻 프리랜서 TOP 5</h2>
    <ul class="space-y-3">
      <li
        v-for="freelancer in props.freelancers"
        :key="freelancer.id"
        class="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition"
      >
        <div class="flex items-center gap-3">
          <img
            :src="freelancer.profileUrl"
            alt="Profile"
            class="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p class="font-semibold text-gray-800">
              {{ freelancer.name }}
              <span class="text-sm text-gray-500">
                ({{ freelancer.careerYears }}년차)
              </span>
            </p>
          </div>
        </div>
        <div
          class="text-sm font-semibold px-2 py-1 rounded-full text-white"
          :class="{
            'bg-yellow-500': freelancer.grade === 'S',
            'bg-blue-500': freelancer.grade === 'A',
            'bg-green-500': freelancer.grade === 'B',
            'bg-gray-500': freelancer.grade === 'C' || freelancer.grade === 'D',
          }"
        >
          {{ freelancer.grade }}
        </div>
      </li>
    </ul>
  </div>
</template>
