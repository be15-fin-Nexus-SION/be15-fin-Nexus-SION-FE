import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchRecommendedTrainings } from "../api/member.js";

export const useTrainingStore = defineStore("training", () => {
  const trainings = ref([]);
  const isLoading = ref(false);

  const fetchRecommendations = async (employeeId) => {
    try {
      isLoading.value = true;

      if (!employeeId) {
        trainings.value = [];
        return;
      }

      const res = await fetchRecommendedTrainings(employeeId);
      const trainingList = res?.data?.data;

      // 응답이 배열이면 정상 처리, 아니면 빈 배열로 초기화
      if (Array.isArray(trainingList)) {
        trainings.value = trainingList;
      } else {
        trainings.value = [];
      }
    } catch (e) {
      trainings.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  return {
    trainings,
    isLoading,
    fetchRecommendations,
  };
});
