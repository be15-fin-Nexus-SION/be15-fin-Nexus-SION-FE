import axios from "./axios";

export const getProjectList = (params) => {
  return axios.post("/projects/list", params);
};
