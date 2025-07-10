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

export function fetchMyProjectList({
  employeeId,
  page = 0,
  size = 4,
  statuses = [],
}) {
  return api.post("/projects/list/my", {
    employeeId,
    page,
    size,
    statuses,
  });
}

export function fetchProjectDetail(projectCode) {
  return api.get(`/projects/list/${projectCode}`);
}

export function updateProjectStatus(projectCode, status) {
  return api.put(`/projects/${projectCode}/status/${status}`);
}

export function addWorkHistories(workId, payload) {
  return api.put(`/dev-project-works/${workId}/histories`, payload);
}

export function approveWorkHistory(id, adminId) {
  return api.put(`/dev-project-works/${id}/approve`, null, {
    params: { adminId },
  });
}

export function rejectWorkHistory(id, adminId) {
  return api.put(`/dev-project-works/${id}/reject`, null, {
    params: { adminId },
  });
}

export function getMyProjectWorkRequests(page = 0, size = 10) {
  return api.get("/dev-project-works/me", {
    params: {
      page,
      size,
    },
  });
}

export function getProjectHistoryDetail(projectWorkId) {
  return api.get(`/dev-project-works/${projectWorkId}`);
}

export const getProjectInfo = (id) => {
  return api.get(`/projects/${id}/project-info`);
};

export async function fetchFunctionTypes() {
  return api.get("/dev-project-works/function-types");
}
