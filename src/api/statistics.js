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
