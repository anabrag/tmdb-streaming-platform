jest.mock("../../models/Movie.model");

const Movie = require("../../models/Movie.model");
const { getStoredMovies, getMovieById } = require("../../services/movie.service");

describe("Movie Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getStoredMovies", () => {
    it("deve retornar os 10 filmes mais recentes", async () => {
      const fakeMovies = [{ title: "Filme A" }, { title: "Filme B" }];
      Movie.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(fakeMovies)
        })
      });

      const movies = await getStoredMovies();

      expect(Movie.find).toHaveBeenCalled();
      expect(movies).toEqual(fakeMovies);
    });
  });

  describe("getMovieById", () => {
    it("deve retornar o filme pelo id", async () => {
      const fakeMovie = { _id: "123", title: "Filme Teste" };
      Movie.findById.mockResolvedValue(fakeMovie);

      const movie = await getMovieById("123");

      expect(Movie.findById).toHaveBeenCalledWith("123");
      expect(movie).toEqual(fakeMovie);
    });

    it("deve retornar null se o filme não for encontrado", async () => {
      Movie.findById.mockResolvedValue(null);

      const movie = await getMovieById("999");

      expect(Movie.findById).toHaveBeenCalledWith("999");
      expect(movie).toBeNull();
    });
  });
});
