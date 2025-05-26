const axios = require("axios");
const Movie = require("../models/Movie.model");

const createTmdbClient = () => axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: process.env.TMDB_API_KEY,
    language: "pt-BR"
  }
});

const getMovieVideos = async (tmdbId) => {
  const tmdb = createTmdbClient();
  const response = await tmdb.get(`/movie/${tmdbId}/videos`);
  return response.data.results;
};

const getRecentMoviesWithTrailers = async () => {
  const tmdb = createTmdbClient();
  const moviesCollected = [];
  let page = 1;
  const maxPages = 10;

  while (moviesCollected.length < 20 && page <= maxPages) {
    const response = await tmdb.get("/movie/now_playing", {
      params: { page }
    });

    const movies = response.data.results;

    for (const movie of movies) {
      if (moviesCollected.length >= 20) break;

      let trailerKey = null;

      try {
        const videos = await getMovieVideos(movie.id);
        const trailer = videos.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        if (trailer) {
          trailerKey = trailer.key;
        }
      } catch (err) {
        console.warn(`Erro ao buscar trailer do filme ${movie.title}:`, err.message);
      }

      moviesCollected.push({
        tmdbId: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster: movie.poster_path,
        backdrop: movie.backdrop_path,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        trailerKey 
      });
    }

    page++;
  }

  return moviesCollected;
};

const SaveRecentMovies = async () => {
  const moviesWithTrailers = await getRecentMoviesWithTrailers();

  const savedMovies = [];

  for (const movieData of moviesWithTrailers) {
    const movie = await Movie.findOneAndUpdate(
      { tmdbId: movieData.tmdbId },
      movieData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    savedMovies.push(movie);
  }

  return savedMovies;
};

module.exports = {
  getRecentMoviesWithTrailers,
  getMovieVideos,
  SaveRecentMovies
};
