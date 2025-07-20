import axios from "./axios"; // 공통 axios 인스턴스 사용

export const getSquadList = ({ projectCode, page, size }) => {
  return axios.get(`/squads/project/${projectCode}`, {
    params: { page, size },
  });
};

export const deleteSquadByCode = (squadCode) => {
  return axios.delete(`/squads/${squadCode}`);
};

export const getSquadDetail = (squadCode) => {
  return axios.get(`/squads/${squadCode}`);
};

export const postSquadComment = (squadCode, content) => {
  return axios.post(`/squads/${squadCode}/comments`, {
    content: content,
  });
};

export const getSquadComments = (squadCode) => {
  return axios.get(`/squads/${squadCode}/comments`);
};

export const deleteSquadComment = (squadCode, commentId) => {
  return axios.delete(`/squads/${squadCode}/comments/${commentId}`);
};

export const patchConfirmSquad = (squadCode) => {
  return axios.patch(`/squads/${squadCode}/confirm`);
};

export const getTechStackAutocomplete = (keyword) => {
  return axios.get("/tech-stack/autocomplete", {
    params: { keyword },
  });
};

export async function searchSquadDevelopers(payload) {
  const response = await axios.post("/members/squad-search", payload);
  return response.data.data;
}

export async function getRecommendedCandidates(projectId) {
  const response = await axios.get(`/squads/candidates?projectId=${projectId}`);
  return response.data;
}

export async function getSquadProjectDetail(projectId) {
  const response = await axios.get(`/projects/squad/${projectId}`);
  return response.data;
}

export async function registerManualSquad(payload) {
  const response = await axios.post("/squads/manual", payload);
  return response.data;
}

export async function updateManualSquad(payload) {
  return axios.put("/squads/manual", payload);
}

export async function recommendSquad({ projectId, criteria }) {
  return axios.post("/squads/recommendation", {
    projectId,
    criteria,
  });
}
