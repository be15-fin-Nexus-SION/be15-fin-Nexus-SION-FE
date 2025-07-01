import api from "./axios.js";

export function getAllJobs() {
  return api.get("/jobs");
}

export function addJob(name) {
  return api.post("/jobs", {
    name,
  });
}

export function deleteJob(name) {
  return api.delete(`/jobs/${encodeURIComponent(name)}`);
}

export function getAllDomains() {
  return api.get("/domains");
}

export function addDomain(name) {
  return api.post("/domains", {
    name,
  });
}

export function deleteDomain(name) {
  return api.delete(`/domains/${encodeURIComponent(name)}`);
}
