import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useSquadStore = defineStore("squad", () => {
  const selectedMembers = ref([]);

  const selectedSquadInfo = ref({
    id: null, // 수정 중인 스쿼드 ID
    title: "", // 스쿼드 제목
    description: "", // 스쿼드 설명
  });

  const leaderId = ref(null);

  const isEditMode = computed(() => selectedSquadInfo.value.id !== null);

  const addMember = (member) => {
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

  const setLeader = (member) => {
    selectedMembers.value = selectedMembers.value.map((m) => ({
      ...m,
      isLeader: false,
      leader: false,
    }));
    leaderId.value = member.id;
    selectedMembers.value = selectedMembers.value.map((m) => ({
      ...m,
      isLeader: m.id === member.id,
    }));
  };

  const resetSquad = () => {
    selectedMembers.value = [];
    selectedSquadInfo.value = {
      id: null,
      title: "",
      description: "",
    };
    leaderId.value = null;
  };

  function hasLeader() {
    return leaderId.value !== null;
  }

  return {
    selectedMembers,
    addMember,
    removeMember,
    selectedSquadInfo,
    isEditMode,
    resetSquad,
    setLeader,
    hasLeader,
  };
});
