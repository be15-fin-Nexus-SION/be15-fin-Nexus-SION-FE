import api from "./axios.js";

export function reissueAccessToken() {
  return api.get("/members/refresh");
}

export function fetchDeveloperList({
  page = 0,
  size = 10,
  status,
  gradeCode,
  role,
  nameInitial,
  sortBy,
  sortDir,
  keyword,
} = {}) {
  const query = { page, size };

  if (status) query.status = status;
  if (gradeCode) query.gradeCode = gradeCode;
  if (role) query.role = role;
  if (nameInitial) query.nameInitial = nameInitial;
  if (sortBy) query.sortBy = sortBy;
  if (sortDir) query.sortDir = sortDir;
  if (keyword) query.keyword = keyword;

  return api.get("/members", { params: query });
}

export function searchDeveloperList({ keyword, page = 0, size = 10 }) {
  console.log("search 호출, " + keyword);
  return api.get("/members/search", {
    params: {
      keyword,
      page,
      size,
    },
  });
}

export const updateMemberStatus = (employeeId, status) => {
  return api.patch(`members/${employeeId}/status`, {
    status: status,
  });
};

export function fetchTechStacksByEmployeeId(employeeId) {
  return api.get(`/members/${employeeId}/tech-stacks`);
}

export function fetchDeveloperDetail(employeeId) {
  return api.get(`/members/${employeeId}`);
}

/* 회원 가입 */
export function signup(payload) {
  return api.post("/members/signup", payload);
}

/* 로그인 */
export function login(payload) {
  return api.post("/members/login", payload);
}

/* 로그아웃 */
export function logout() {
  return api.post("/members/logout");
}

export function registerDevelopers(developers) {
  return api.post("/members", developers);
}

export function fetchPositionList() {
  return api.get("/positions");
}

export function fetchDepartmentList() {
  return api.get("/departments");
}

export function updateDeveloper(employeeId, updateRequest) {
  return api.put(`/members/${employeeId}`, updateRequest);
}

export function deleteDeveloper(employeeId) {
  return api.delete(`/members/${employeeId}`);
}

export function getUnitPriceByGrade() {
  return api.get(`/grades`);
}

export function setUnitPriceByGrade(grades) {
  return api.post(`/grades`, grades);
}

export function fetchCertificates() {
  return api.get("/certificates");
}

export function registerCertificate(certificateRequest) {
  return api.post("/certificates/register", certificateRequest);
}

export function updateCertificate(certificateName, payload) {
  return api.patch(`/certificates/${certificateName}`, payload);
}

export function deleteCertificate(id) {
  return api.delete(`/certificates/${id}`);
}

export function fetchCertificateApprovals({
  status,
  page = 0,
  size = 10,
} = {}) {
  const query = { page, size };
  if (status) query.status = status;

  return api.get("/admin/certificates", { params: query });
}

export function approveCertificate(certificateId) {
  return api.patch(`/admin/certificates/${certificateId}/approve`);
}

export function rejectCertificate(certificateId, reason) {
  return api.patch(`/admin/certificates/${certificateId}/reject`, {
    rejectedReason: reason,
  });
}

export function searchAdmins(payload) {
  return api.get("/members/search/admins", {
    params: payload,
  });
}

export function fetchMyCertificates() {
  return api.get("/user-certificates/me");
}

export const developerRegisterCertificate = (employeeId, formData) => {
  return api.post(`/members/${employeeId}/certificates`, formData);
}

export function fetchScoreSummary(id) {
  return api.get(`/member-scores/${id}`);
}

