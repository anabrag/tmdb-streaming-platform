jest.mock("../../models/Playlist.model");
const Playlist = require("../../models/Playlist.model");
const {
  createPlaylist,
  addMovieToPlaylist,
  getPlaylistsByUser,
  getAllPlaylists,
  removeMovieFromPlaylist,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
} = require("../../services/playlist.service");

describe("Playlist Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createPlaylist", () => {
    it("deve criar uma nova playlist e salvar", async () => {
      const fakePlaylist = { save: jest.fn().mockResolvedValue("savedPlaylist") };
      Playlist.mockImplementation(() => fakePlaylist);

      const result = await createPlaylist("Minha Playlist", "user123");

      expect(Playlist).toHaveBeenCalledWith({ name: "Minha Playlist", user: "user123", movies: [] });
      expect(fakePlaylist.save).toHaveBeenCalled();
      expect(result).toBe("savedPlaylist");
    });
  });

  describe("addMovieToPlaylist", () => {
    it("deve adicionar um filme à playlist e popular movies", async () => {
      const updatedPlaylist = { _id: "playlistId", movies: ["movie1"] };
      Playlist.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(updatedPlaylist),
      });

      const result = await addMovieToPlaylist("playlistId", "movie1");

      expect(Playlist.findByIdAndUpdate).toHaveBeenCalledWith(
        "playlistId",
        { $addToSet: { movies: "movie1" } },
        { new: true }
      );
      expect(result).toBe(updatedPlaylist);
    });
  });

  describe("getPlaylistsByUser", () => {
    it("deve retornar playlists do usuário com movies populados", async () => {
      const playlists = [{ name: "Playlist1" }];
      Playlist.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(playlists),
      });

      const result = await getPlaylistsByUser("user123");

      expect(Playlist.find).toHaveBeenCalledWith({ user: "user123" });
      expect(result).toBe(playlists);
    });
  });

  describe("getAllPlaylists", () => {
    it("deve retornar todas as playlists com movies populados", async () => {
      const playlists = [{ name: "Playlist1" }, { name: "Playlist2" }];
      Playlist.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(playlists),
      });

      const result = await getAllPlaylists();

      expect(Playlist.find).toHaveBeenCalledWith();
      expect(result).toBe(playlists);
    });
  });

  describe("removeMovieFromPlaylist", () => {
    it("deve remover filme da playlist e popular movies", async () => {
      const updatedPlaylist = { _id: "playlistId", movies: [] };
      Playlist.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(updatedPlaylist),
      });

      const result = await removeMovieFromPlaylist("playlistId", "movie1");

      expect(Playlist.findByIdAndUpdate).toHaveBeenCalledWith(
        "playlistId",
        { $pull: { movies: "movie1" } },
        { new: true }
      );
      expect(result).toBe(updatedPlaylist);
    });
  });

  describe("getPlaylistById", () => {
    it("deve retornar playlist por id com movies populados", async () => {
      const playlist = { _id: "playlistId", name: "Playlist1" };
      Playlist.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(playlist),
      });

      const result = await getPlaylistById("playlistId");

      expect(Playlist.findById).toHaveBeenCalledWith("playlistId");
      expect(result).toBe(playlist);
    });
  });

  describe("updatePlaylist", () => {
    it("deve atualizar playlist e retornar nova versão", async () => {
      const updatedPlaylist = { _id: "playlistId", name: "Nova Playlist" };
      Playlist.findByIdAndUpdate.mockResolvedValue(updatedPlaylist);

      const result = await updatePlaylist("playlistId", { name: "Nova Playlist" });

      expect(Playlist.findByIdAndUpdate).toHaveBeenCalledWith("playlistId", { name: "Nova Playlist" }, { new: true });
      expect(result).toBe(updatedPlaylist);
    });
  });

  describe("deletePlaylist", () => {
    it("deve deletar playlist por id", async () => {
      const deletedPlaylist = { _id: "playlistId", name: "Playlist Deletada" };
      Playlist.findByIdAndDelete.mockResolvedValue(deletedPlaylist);

      const result = await deletePlaylist("playlistId");

      expect(Playlist.findByIdAndDelete).toHaveBeenCalledWith("playlistId");
      expect(result).toBe(deletedPlaylist);
    });
  });
});
