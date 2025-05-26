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
  const response = await tmdb.get("/movie/now_playing", {
    params: { page: 1 }
  });

  const movies = response.data.results;
  const moviesWithTrailers = [];

  for (const movie of movies) {
    const videos = await getMovieVideos(movie.id);

    const trailer = videos.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );

    if (trailer) {
      moviesWithTrailers.push({
        tmdbId: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster: movie.poster_path,
        backdrop: movie.backdrop_path,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        trailerKey: trailer.key
      });
    }

    if (moviesWithTrailers.length >= 10) break;
  }

  return moviesWithTrailers;
};

const SaveRecentMovies= async () => {
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
