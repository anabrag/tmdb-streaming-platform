const express = require("express");
const router = express.Router();
const { getStoredMovies, getMovieById } = require("../services/movie.service");

router.get("/movies", async (req, res) => {
  try {
    const movies = await getStoredMovies();
    res.json(movies);
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    res.status(500).json({ message: "Erro ao buscar filmes" });
  }
});

router.get("/movies/:id", async (req, res) => {
  try {
    const movie = await getMovieById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Filme não encontrado" });
    }
    res.json(movie);
  } catch (error) {
    console.error("Erro ao buscar filme por ID:", error);
    res.status(500).json({ message: "Erro ao buscar filme por ID" });
  }
});

module.exports = router;
