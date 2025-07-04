import axios from "./axios"; // 공통 axios 인스턴스 사용

export const getSquadList = ({ projectCode, page, size }) => {
  return axios.get(`/squads/project/${projectCode}`, {
    params: { page, size },
  });
};

export const deleteSquadByCode = (squadCode) => {
  return axios.delete(`/squads/${squadCode}`);
};

export const getTechStackAutocomplete = (keyword) => {
  return axios.get("/tech-stack/autocomplete", {
    params: { keyword },
  });
};

export async function searchSquadDevelopers(payload) {
  try {
    const response = await axios.post("/members/squad-search", payload);
    return response.data.data;
  } catch (error) {
    console.error("개발자 조회 실패:", error);
    throw error;
  }
}
