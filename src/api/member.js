import api from "./axios.js";

export function reissueAccessToken() {
  return api.get("/members/token");
}

export function fetchDeveloperList({
                                     page = 0,
                                     size = 10,
                                     status,
                                     nameInitial,
                                     sortBy,
                                     sortDir,
    keyword,
                                   } = {}) {
  const query = { page, size };

  if (status) query.status = status;
  if (nameInitial) query.nameInitial = nameInitial;
  if (sortBy) query.sortBy = sortBy;
  if (sortDir) query.sortDir = sortDir;
  if (keyword) query.keyword = keyword;

  return api.get("/members", { params: query });
}

export function searchDeveloperList({
                                        keyword,
                                        page = 0,
                                        size = 10
                                    }) {
    return api.get("/members/search", {
        params: {
            keyword,
            page,
            size
        }
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