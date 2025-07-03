import axios from "./axios"; // 공통 axios 인스턴스 사용

export const getSquadList = ({ projectCode, page, size }) => {
  return axios.get(`/squads/project/${projectCode}`, {
    params: { page, size },
  });
};
