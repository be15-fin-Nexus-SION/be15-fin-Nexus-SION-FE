import api from "./axios";

export function registerProject(payload) {
  return api.post("/projects", payload);
}

export function fetchProjectList({
  keyword,
  maxBudget,
  maxPeriodInMonth,
  maxNumberOfMembers,
  statuses,
  page = 0,
  size = 4,
}) {
  return api.post("/projects/list", {
    keyword,
    maxBudget,
    maxPeriodInMonth,
    maxNumberOfMembers,
    statuses,
    page,
    size,
  });
}

export function fetchProjectDetail(projectCode) {
  return api.get(`/projects/list/${projectCode}`);
}

export function updateProjectStatus(projectCode, status) {
  return api.put(`/projects/${projectCode}/status/${status}`);
}
