import api from "./api";

export const createPlaylist = async (name, userId) => {
  const response = await api.post("/playlists", { name, userId });
  return response.data;
};

export const addMovieToPlaylist = async (playlistId, movieId) => {
  const response = await api.post(`/playlists/${playlistId}/movies`, { movieId });
  return response.data;
};

export const removeMovieFromPlaylist = async (playlistId, movieId) => {
  const response = await api.delete(`/playlists/${playlistId}/movies/${movieId}`);
  return response.data;
};

export const getUserPlaylists = async (userId) => {
  const response = await api.get(`/playlists?userId=${userId}`);
  return response.data;
};

export const getPlaylistById = async (playlistId) => {
  const response = await api.get(`/playlists/${playlistId}`);
  return response.data;
};

export const updatePlaylist = async (playlistId, updateData) => {
  const response = await api.patch(`/playlists/${playlistId}`, updateData);
  return response.data;
};

export const deletePlaylist = async (playlistId) => {
  const response = await api.delete(`/playlists/${playlistId}`);
  return response.status === 204;
};
