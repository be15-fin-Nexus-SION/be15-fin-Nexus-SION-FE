import api from "./axios.js"; // axios 인스턴스를 사용하는 경우

export async function fetchAllTechStacks() {
  return api.get("/tech-stack");
}
