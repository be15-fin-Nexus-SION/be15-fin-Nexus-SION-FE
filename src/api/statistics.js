import api from "./axios.js";

export function getStackMemberCounts(data) {
  return api.post("/statistics/stack/member-count", data);
}

export function getAllTechStacks() {
  return api.get("/statistics/all-tech-stacks");
}

export async function fetchDevelopers(page = 1) {
  return api.get(`/statistics/developers?page=${page}&size=10`);
}

export function getStackAvgCareer(stackList) {
  if (!Array.isArray(stackList)) {
    console.warn("getStackAvgCareer: stackList가 배열이 아님", stackList);
    stackList = [];
  }

  const query = stackList
    .map((s) => `selectedStacks=${encodeURIComponent(s)}`)
    .join("&");
  return api.get(`/statistics/stack/average-career?${query}`);
}
