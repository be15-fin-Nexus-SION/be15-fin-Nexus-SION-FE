import api from "./axios";

export function fetchAllJobs() {
  return api.get("/jobs"); // 백엔드의 직무 조회 API 경로
}
