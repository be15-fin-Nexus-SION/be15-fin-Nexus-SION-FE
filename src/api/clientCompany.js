// api/clientCompany.js
import api from "./axios";

export function fetchAllClientCompanies() {
  return api.get("/client-companies").then((res) => {
    const content = res.data?.data?.content ?? [];
    const clients = content.map((c) => ({
      code: c.clientCode,
      companyName: c.companyName,
    }));
    return { data: { clients } };
  });
}
