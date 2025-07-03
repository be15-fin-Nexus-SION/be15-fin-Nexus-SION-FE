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

export function getAllTechStacks() {
  return api.get("/tech-stack");
}

export function addTechStack(techStackName) {
  return api.post("/tech-stack", {
    techStackName,
  });
}

export function deleteTechStack(name) {
  return api.delete(`/tech-stack/${encodeURIComponent(name)}`);
}

export function getAllInitialScores() {
  return api.get("/initial-scores");
}

export function setInitialScores(initialScores) {
  return api.post("/initial-scores", initialScores);
}

export function getAllClients() {
  return api.get("/client-companies");
}

export function addClient(data) {
  return api.post("/client-companies", data);
}

export function updateClient(clientCode, data) {
  return api.patch(`/client-companies/${clientCode}`, data);
}

export function deleteClient(clientCode) {
  return api.delete(`/client-companies/${clientCode}`);
}
