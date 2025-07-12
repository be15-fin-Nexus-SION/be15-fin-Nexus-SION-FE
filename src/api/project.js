import api from "./axios";

export function registerProject(payload) {
  return api.post("/projects", payload);
}

export function updateProject(projectCode, payload) {
  return api.put(`/projects/${projectCode}`, payload);
}

export function deleteProject(projectCode) {
  return api.delete(`/projects/${projectCode}`);
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

export function uploadDocument(formData) {
  return api.post("/documents/upload", formData);
}

export function fetchProjectListByMember(employeeId, page = 0, size = 1) {
  return api.get(`/projects/member/${employeeId}/list`, {
    params: { page, size },
  });
}

export async function analyzeProject(projectCode, file) {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`/projects/${projectCode}/analyze`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function addWorkHistories(workId, payload) {
  return api.put(`/dev-project-works/${workId}/histories`, payload);
}

export function approveWorkHistory(id, adminId) {
  return api.put(`/dev-project-works/${id}/approve`, null, {
    params: { adminId },
  });
}

export async function rejectWorkHistory({ id, adminId, reason }) {
  return api.put(`/dev-project-works/${id}/reject`, null, {
    params: { adminId, reason },
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

export function getRequestsForAdmin(query) {
  return api.get("/dev-project-works/admin", { params: query });
}

export function getProjectHistoryDetail(projectWorkId) {
  return api.get(`/dev-project-works/${projectWorkId}`);
}

export function getProjectInfo(id) {
  return api.get(`/projects/${id}/project-info`);
}

export function fetchFunctionTypes() {
  return api.get("/dev-project-works/function-types");
}

export function replaceProjectSquad(payload) {
  return api.put("/projects/replacement", payload);
}

export function replaceRecommendation(payload) {
  return api.post("/projects/replacement", payload);
}
