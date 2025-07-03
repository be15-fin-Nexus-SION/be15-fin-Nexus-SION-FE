import api from "./axios";

export function fetchProjectList({
  keyword,
  maxBudget,
  maxPeriodInMonth,
  maxNumberOfMembers,
  statuses,
  page = 0,
  size = 4,
}) {
  const payload = {
    keyword,
    maxBudget,
    maxPeriodInMonth,
    maxNumberOfMembers,
    statuses,
    page,
    size,
  };

  return api.post("/projects/list", payload);
}
