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

  const updateIsLeaderFlags = () => {
    selectedMembers.value = selectedMembers.value.map((m) => ({
      ...m,
      isLeader: m.id === leaderId.value,
    }));
  };

  const addMember = (member) => {
    const exists = selectedMembers.value.some((m) => m.id === member.id);
    if (!exists) {
      selectedMembers.value.push({
        ...member,
        isLeader: member.id === leaderId.value, // 동기화 보장
      });

      if (member.leader) {
        leaderId.value = member.id;
        updateIsLeaderFlags(); // 꼭 동기화
      }
    }
  };

  const removeMember = (employeeId) => {
    selectedMembers.value = selectedMembers.value.filter(
      (m) => m.id !== employeeId,
    );

    if (leaderId.value === employeeId) {
      leaderId.value = null;
    }

    updateIsLeaderFlags();
  };

  const setLeader = (member) => {
    leaderId.value = member.id;
    updateIsLeaderFlags();
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

  return {
    selectedMembers,
    addMember,
    removeMember,
    selectedSquadInfo,
    isEditMode,
    resetSquad,
    setLeader,
    leaderId,
  };
});
