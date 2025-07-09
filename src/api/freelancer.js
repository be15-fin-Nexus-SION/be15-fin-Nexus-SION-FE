import api from "./axios";

export function fetchFreelancerList({ page = 1, size = 10 }) {
  return api.get("/freelancers", {
    params: { page, size },
  });
}

export function fetchFreelancerDetail(freelancerId) {
  return api.get(`/freelancers/${freelancerId}`);
}

export function registerFreelancerAsMember(freelancerId) {
  return api.post(`/freelancers/${freelancerId}/register`);
}
