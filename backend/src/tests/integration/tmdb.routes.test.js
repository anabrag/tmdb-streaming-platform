jest.mock("../../services/tmdb.service", () => ({
  fetchAndSaveRecentMoviesWithTrailers: jest.fn(),
}));

const request = require("supertest");
const express = require("express");
const tmdbRoutes = require("../../routes/tmdb.routes"); 

const tmdbService = require("../../services/tmdb.service");

describe("TMDB Routes Integration", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/api/tmdb", tmdbRoutes); 
  });

  it("GET /api/tmdb/movies - deve retornar lista de filmes", async () => {
    const mockMovies = [
      { id: 1, title: "Mock Movie 1" },
      { id: 2, title: "Mock Movie 2" },
    ];

    tmdbService.SaveRecentMovies = jest.fn().mockResolvedValue(mockMovies);

    const res = await request(app).get("/api/tmdb/movies");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockMovies);
    expect(tmdbService.SaveRecentMovies).toHaveBeenCalled();
  });

  it("GET /api/tmdb/movies - deve retornar erro 500 em caso de falha", async () => {
    tmdbService.fetchAndSaveRecentMoviesWithTrailers.mockRejectedValue(new Error("Erro ao buscar filmes"));
    tmdbService.SaveRecentMovies = jest.fn().mockRejectedValue(new Error("Erro ao buscar filmes"));

    const res = await request(app).get("/api/tmdb/movies");

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ message: "Erro ao buscar filmes" });
  });
});
