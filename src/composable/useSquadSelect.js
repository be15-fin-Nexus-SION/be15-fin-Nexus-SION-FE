// composables/useSquadSelect.js
import { useSquadStore } from "@/stores/squadCreateStore.js";
import { getSquadDetail } from "@/api/squad.js";

export async function handleSquadSelect(squadCode) {
  const squadStore = useSquadStore();

  try {
    const resp = await getSquadDetail(squadCode);
    const squadData = await resp.data.data;

    squadStore.resetSquad();

    let leaderMember;

    const parsedMembers = squadData.members.map((member) => {
      if (member.leader) {
        leaderMember = member;
      }

      return {
        id: member.memberId,
        name: member.name,
        grade: member.grade,
        monthlyUnitPrice: member.monthlyUnitPrice,
        productivity: member.productivity,
        role: member.job,
        imageUrl: member.imageUrl,
        leader: member.leader,
      };
    });

    if (leaderMember) {
      squadStore.setLeader(leaderMember);
    }

    parsedMembers.forEach((m) => squadStore.addMember(m));

    squadStore.selectedSquadInfo.value = {
      id: squadData.squadCode,
      title: squadData.title,
      description: squadData.description,
    };
    console.log("set info", squadStore.selectedSquadInfo.value);
  } catch (e) {
    console.error("스쿼드 불러오기 실패:", e);
  }
}
