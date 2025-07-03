import api from "./axios";

/**
 * 프로젝트 등록 API
 * @param {Object} payload ProjectRegisterRequest DTO 형식의 객체
 * @returns {Promise}
 */
export function registerProject(payload) {
  return api.post("/projects", payload);
}

/**
 * 프로젝트 목록 조회 API (필터 조건 포함)
 * @param {Object} params 필터 조건 및 페이지 정보
 * @returns {Promise}
 */
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
