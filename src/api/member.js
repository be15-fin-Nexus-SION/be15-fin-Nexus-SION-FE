import api from "./axios.js";

export function reissueAccessToken() {
  return api.get("/members/token");
}
