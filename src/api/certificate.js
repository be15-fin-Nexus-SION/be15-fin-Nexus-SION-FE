import api from "@/api/axios";

export function fetchAllCertificates() {
  return api.get("/certificates"); // 전체 자격증 목록
}

export function fetchUserCertificates() {
  return api.get("/user-certificates/me"); // 로그인 사용자의 취득 자격증 목록
}
