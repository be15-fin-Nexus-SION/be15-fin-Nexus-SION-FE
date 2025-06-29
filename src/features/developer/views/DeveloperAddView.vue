<template>
  <div class="max-w-5xl mx-auto py-10 space-y-6">
    <h1 class="text-2xl font-bold text-center">개발자 등록</h1>

    <div v-for="(dev, index) in developers" :key="index">
      <DeveloperFormCard
          v-model="developers[index]"
          @remove="removeDeveloper(index)"
      />
    </div>

    <div class="flex justify-center">
      <button
          @click="addDeveloper"
          class="w-14 h-14 flex items-center justify-center bg-primary text-white text-2xl rounded-full shadow-md"
      >
        +
      </button>
    </div>

    <div class="flex justify-center">
      <button @click="submit" class="bg-indigo-600 text-white px-6 py-2 rounded-lg mt-4">등록</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import DeveloperFormCard from '../components/DeveloperFormCard.vue';

const developers = reactive([
  {
    name: '',
    employeeId: '',
    phoneNumber: '',
    email: '',
    joinedAt: '',
    leftAt: '',
    careerYears: '',
    profileImage: null,
    techStacks: [],
  }
]);

function addDeveloper() {
  developers.push({
    name: '',
    employeeId: '',
    phoneNumber: '',
    email: '',
    joinedAt: '',
    leftAt: '',
    careerYears: '',
    profileImage: null,
    techStacks: [],
  });
}

function removeDeveloper(index) {
  developers.splice(index, 1);
}

function submit() {
  // 등록 API 호출
  console.log('등록할 개발자들:', developers);
  // 각 profileImage는 FormData로 별도 처리 가능
}
</script>