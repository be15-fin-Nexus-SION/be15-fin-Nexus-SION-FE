// squadProjectStore.js
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { getSquadProjectDetail } from "@/api/squad.js";

export const useSquadProjectStore = defineStore("squadProject", () => {
  const projectDetail = reactive({
    data: null,
  });
  const loading = ref(false);
  const error = ref(null);

  async function fetchProjectDetail(projectCode) {
    loading.value = true;
    error.value = null;
    try {
      const res = await getSquadProjectDetail(projectCode);
      if (res.success) {
        projectDetail.data = res.data; // 내부 대입 (리액티브 유지)
      } else {
        throw new Error("프로젝트 로딩 실패");
      }
    } catch (e) {
      console.error("프로젝트 로딩 에러:", e);
      error.value = e;
      projectDetail.data = null;
    } finally {
      loading.value = false;
    }
  }

  function resetProjectDetail() {
    projectDetail.data = null;
  }

  return {
    projectDetail,
    loading,
    error,
    fetchProjectDetail,
    resetProjectDetail,
  };
});
