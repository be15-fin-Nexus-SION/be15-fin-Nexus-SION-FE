import api from "./axios";

export async function fetchAllDomains() {
  return api.get("/domains");
}
