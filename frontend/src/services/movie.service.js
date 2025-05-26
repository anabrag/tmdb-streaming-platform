import api from "./api";

export const getMovies = async () => {
  const response = await api.get("/movies");
  return response.data;
};

export const getMovieById = async (id) => {
  try {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error('getMovieById error:', error);
    return null;
  }
};




