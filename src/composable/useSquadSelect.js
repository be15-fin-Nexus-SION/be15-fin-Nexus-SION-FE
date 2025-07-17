// composables/useSquadSelect.js
import { useSquadStore } from "@/stores/squadCreateStore.js";
import { getSquadDetail } from "@/api/squad.js";

export async function handleSquadSelect(squadCode) {
  const squadStore = useSquadStore();

  try {
    const resp = await getSquadDetail(squadCode);
    const squadData = await resp.data.data;

    squadStore.resetSquad();

    const leaderMember = squadData.members.find((m) => m.leader);
    if (leaderMember) {
      squadStore.setLeader({ id: leaderMember.memberId });
    }

    const parsedMembers = squadData.members.map((member) => ({
      id: member.memberId,
      name: member.name,
      grade: member.grade,
      monthlyUnitPrice: member.monthlyUnitPrice,
      productivity: member.productivity,
      role: member.job,
      imageUrl: member.imageUrl,
    }));

    parsedMembers.forEach((m) => squadStore.addMember(m));

    squadStore.selectedSquadInfo.value = {
      id: squadData.squadCode,
      title: squadData.title,
      description: squadData.description,
    };
  } catch (e) {
    console.error("스쿼드 불러오기 실패:", e);
  }
}
