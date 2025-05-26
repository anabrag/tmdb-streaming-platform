const express = require("express");
const router = express.Router();
const tmdbService = require("../services/tmdb.service");

router.get("/movies", async (req, res) => {
  try {
    const savedMovies = await tmdbService.SaveRecentMovies();
    res.json(savedMovies);
  } catch (err) {
    console.error("Erro ao buscar filmes:", err);
    res.status(500).json({ message: "Erro ao buscar filmes" });
  }
});

module.exports = router;
