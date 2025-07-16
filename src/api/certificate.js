import api from "@/api/axios";

export function fetchAllCertificates() {
  return api.get("/certificates"); // 전체 자격증 목록
}

export function fetchUserCertificates(employeeId) {
  return api.get(`/user-certificates/${employeeId}`);
}
