import api from "./axios.js";

export function getAllJobs() {
  return api.get("/jobs");
}

export function addJobApi(name) {
  return api.post("/jobs", {
    name,
  });
}

export function deleteJobApi(name) {
  return api.delete(`/jobs/${encodeURIComponent(name)}`);
}
