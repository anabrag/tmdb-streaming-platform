jest.mock("../../services/playlist.service");
const request = require("supertest");
const express = require("express");
const playlistRoutes = require("../../routes/playlist.routes");

const playlistService = require("../../services/playlist.service");

const app = express();
app.use(express.json());
app.use("/", playlistRoutes);

describe("Playlist Routes - Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /playlists - cria playlist", async () => {
    const fakePlaylist = { id: "1", name: "Minha Playlist", userId: "user1" };
    playlistService.createPlaylist.mockResolvedValue(fakePlaylist);

    const res = await request(app)
      .post("/playlists")
      .send({ name: "Minha Playlist", userId: "user1" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(fakePlaylist);
    expect(playlistService.createPlaylist).toHaveBeenCalledWith("Minha Playlist", "user1");
  });

  test("GET /playlists - busca playlists por usuário", async () => {
    const fakePlaylists = [{ id: "1", name: "Playlist 1", userId: "user1" }];
    playlistService.getPlaylistsByUser.mockResolvedValue(fakePlaylists);

    const res = await request(app).get("/playlists?userId=user1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakePlaylists);
    expect(playlistService.getPlaylistsByUser).toHaveBeenCalledWith("user1");
  });

  test("GET /playlists/:playlistId - busca playlist por id", async () => {
    const fakePlaylist = { id: "1", name: "Playlist 1" };
    playlistService.getPlaylistById.mockResolvedValue(fakePlaylist);

    const res = await request(app).get("/playlists/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakePlaylist);
    expect(playlistService.getPlaylistById).toHaveBeenCalledWith("1");
  });

  test("PATCH /playlists/:playlistId - atualiza playlist", async () => {
    const updatedPlaylist = { id: "1", name: "Playlist Atualizada" };
    playlistService.updatePlaylist.mockResolvedValue(updatedPlaylist);

    const res = await request(app).patch("/playlists/1").send({ name: "Playlist Atualizada" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(updatedPlaylist);
    expect(playlistService.updatePlaylist).toHaveBeenCalledWith("1", { name: "Playlist Atualizada" });
  });

  test("DELETE /playlists/:playlistId - deleta playlist", async () => {
    playlistService.deletePlaylist.mockResolvedValue();

    const res = await request(app).delete("/playlists/1");

    expect(res.statusCode).toBe(204);
    expect(playlistService.deletePlaylist).toHaveBeenCalledWith("1");
  });

  test("POST /playlists/:playlistId/movies - adiciona filme à playlist", async () => {
    const updatedPlaylist = { id: "1", movies: ["movie1"] };
    playlistService.addMovieToPlaylist.mockResolvedValue(updatedPlaylist);

    const res = await request(app)
      .post("/playlists/1/movies")
      .send({ movieId: "movie1" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(updatedPlaylist);
    expect(playlistService.addMovieToPlaylist).toHaveBeenCalledWith("1", "movie1");
  });

  test("DELETE /playlists/:playlistId/movies/:movieId - remove filme da playlist", async () => {
    const updatedPlaylist = { id: "1", movies: [] };
    playlistService.removeMovieFromPlaylist.mockResolvedValue(updatedPlaylist);

    const res = await request(app).delete("/playlists/1/movies/movie1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(updatedPlaylist);
    expect(playlistService.removeMovieFromPlaylist).toHaveBeenCalledWith("1", "movie1");
  });
});
