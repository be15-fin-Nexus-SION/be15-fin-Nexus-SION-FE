import api from "./axios.js";

export function getStackMemberCounts(data) {
  return api.post("/statistics/stack/member-count", data);
}

export function getAllTechStacks() {
  return api.get("/statistics/all-tech-stacks");
}

export async function fetchDevelopers(page = 0) {
  return api.get(`/statistics/developers?page=${page}&size=10`);
}

export function getStackAvgCareer({
  stackList = [],
  page = 0,
  size = 10,
  sort = "techStackName",
  direction = "asc",
}) {
  if (!Array.isArray(stackList)) {
    console.warn("getStackAvgCareer: stackList가 배열이 아님", stackList);
    stackList = [];
  }

  const stackQuery = stackList
    .map((s) => `selectedStacks=${encodeURIComponent(s)}`)
    .join("&");

  const pageQuery = `page=${page}&size=${size}&sort=${sort}&direction=${direction}`;
  return api.get(`/statistics/stack/average-career?${stackQuery}&${pageQuery}`);
}

export function getPopularTechStacks(period = "1m", top = 10) {
  return api.get("/statistics/stack/popular", {
    params: { period, top },
  });
}

export function getJobParticipationStats() {
  return api.get("/statistics/participation");
}

export function getWaitingCountByGrade() {
  return api.get("/statistics/waiting-count-by-grade");
}

export function getSalaryByGrade() {
  return api.get("/statistics/salary-stats-by-grade");
}
