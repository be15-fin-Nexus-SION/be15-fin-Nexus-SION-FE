import { defineStore } from "pinia";
import { ref } from "vue";

export const useSquadStore = defineStore("squad", () => {
  // 스쿼드 구성원 목록
  const selectedMembers = ref([]);

  // 개발자 추가 (중복 방지)
  function addMember(member) {
    const exists = selectedMembers.value.some((m) => m.id === member.id);
    if (!exists) {
      selectedMembers.value.push(member);
    }
  }

  // 개발자 제거
  function removeMember(memberId) {
    selectedMembers.value = selectedMembers.value.filter(
      (m) => m.id !== memberId,
    );
    console.log(memberId);
    console.log(selectedMembers.value);
  }

  // 전체 초기화
  function clearMembers() {
    selectedMembers.value = [];
  }

  return {
    selectedMembers,
    addMember,
    removeMember,
    clearMembers,
  };
});
