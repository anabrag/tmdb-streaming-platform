const Playlist = require("../models/Playlist.model");

async function createPlaylist(name, userId) {
  const playlist = new Playlist({ name, user: userId, movies: [] });
  return await playlist.save();
}

async function addMovieToPlaylist(playlistId, movieId) {
  return await Playlist.findByIdAndUpdate(
    playlistId,
    { $addToSet: { movies: movieId } },
    { new: true }
  ).populate("movies");
}

async function getPlaylistsByUser(userId) {
  return await Playlist.find({ user: userId }).populate("movies");
}

async function getAllPlaylists() {
  return await Playlist.find().populate("movies");
}

async function removeMovieFromPlaylist(playlistId, movieId) {
  return await Playlist.findByIdAndUpdate(
    playlistId,
    { $pull: { movies: movieId } },
    { new: true }
  ).populate("movies");
}

async function getPlaylistById(playlistId) {
  return await Playlist.findById(playlistId).populate("movies");
}

async function updatePlaylist(playlistId, updateData) {
  return await Playlist.findByIdAndUpdate(playlistId, updateData, { new: true });
}

async function deletePlaylist(playlistId) {
  return await Playlist.findByIdAndDelete(playlistId);
}

module.exports = {
  createPlaylist,
  addMovieToPlaylist,
  getPlaylistsByUser,
  getAllPlaylists,
  removeMovieFromPlaylist,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
};
