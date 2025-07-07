import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useSquadStore = defineStore("squad", () => {
  const selectedMembers = ref([]);

  const selectedSquadInfo = ref({
    id: null, // 수정 중인 스쿼드 ID
    title: "", // 스쿼드 제목
    description: "", // 스쿼드 설명
  });

  const isEditMode = computed(() => selectedSquadInfo.value.id !== null);

  const addMember = (member) => {
    console.log(member);
    const exists = selectedMembers.value.some((m) => m.id === member.id);
    if (!exists) {
      selectedMembers.value.push(member);
    }
  };

  const removeMember = (employeeId) => {
    selectedMembers.value = selectedMembers.value.filter(
      (m) => m.id !== employeeId,
    );
  };

  const resetSquad = () => {
    selectedMembers.value = [];
    selectedSquadInfo.value = {
      id: null,
      title: "",
      description: "",
    };
  };

  return {
    selectedMembers,
    addMember,
    removeMember,
    selectedSquadInfo,
    isEditMode,
    resetSquad,
  };
});
