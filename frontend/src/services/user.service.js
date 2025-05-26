import api from "./api";

export const getMockUser = async () => {
  const response = await api.get("/users/mock");
  return response.data;
};
