import api from "./axios";

export function uploadDocument(formData) {
  return api.post("/document/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function deleteDocument(prefix, filename) {
  return api.delete("/document/delete", {
    params: { prefix, filename },
  });
}
