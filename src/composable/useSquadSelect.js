// composables/useSquadSelect.js
import { useSquadStore } from "@/stores/squadCreateStore.js";
import { getSquadDetail } from "@/api/squad.js";

export async function handleSquadSelect(squadCode) {
  const squadStore = useSquadStore();

  try {
    const resp = await getSquadDetail(squadCode);
    const squadData = await resp.data.data;

    squadStore.resetSquad();

    const parsedMembers = squadData.members.map((member) => {
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

    parsedMembers.forEach((m) => squadStore.addMember(m));

    squadStore.selectedSquadInfo = {
      id: squadData.squadCode,
      title: squadData.title,
      description: squadData.description,
    };
  } catch (e) {
    console.error("스쿼드 불러오기 실패:", e);
  }
}

function parseCurrency(value) {
  if (!value) return 0;
  return parseInt(value.replace(/[₩,]/g, ""), 10);
}
