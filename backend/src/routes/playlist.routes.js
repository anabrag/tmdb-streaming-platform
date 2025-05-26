const express = require("express");
const router = express.Router();
const playlistService = require("../services/playlist.service");

router.post("/playlists", async (req, res) => {
  const { name, userId } = req.body;
    try {
      const playlist = await playlistService.createPlaylist(name, userId);
      res.status(201).json(playlist);
    } catch (err) {
      res.status(500).json({ message: "Erro ao criar playlist" });
    }
});

router.get("/playlists", async (req, res) => {
  const { userId } = req.query;
    try {
      const playlists = userId
        ? await playlistService.getPlaylistsByUser(userId)
        : await playlistService.getAllPlaylists();
      res.json(playlists);
    } catch (err) {
      res.status(500).json({ message: "Erro ao buscar playlists" });
    }
});

router.get("/playlists/:playlistId", async (req, res) => {
  const { playlistId } = req.params;
    try {
      const playlist = await playlistService.getPlaylistById(playlistId);
      res.json(playlist);
    } catch (err) {
      res.status(500).json({ message: "Erro ao buscar playlist" });
    }
});

router.patch("/playlists/:playlistId", async (req, res) => {
  const { playlistId } = req.params;
  const updateData = req.body;
    try {
      const updated = await playlistService.updatePlaylist(playlistId, updateData);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Erro ao atualizar playlist" });
    }
});

router.delete("/playlists/:playlistId", async (req, res) => {
  const { playlistId } = req.params;
    try {
      await playlistService.deletePlaylist(playlistId);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Erro ao deletar playlist" });
    }
});

router.post("/playlists/:playlistId/movies", async (req, res) => {
  const { playlistId } = req.params;
  const { movieId } = req.body;
    try {
      const updated = await playlistService.addMovieToPlaylist(playlistId, movieId);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Erro ao adicionar filme à playlist" });
    }
});

router.delete("/playlists/:playlistId/movies/:movieId", async (req, res) => {
  const { playlistId, movieId } = req.params;
    try {
      const updated = await playlistService.removeMovieFromPlaylist(playlistId, movieId);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Erro ao remover filme da playlist" });
    }
});

module.exports = router;
