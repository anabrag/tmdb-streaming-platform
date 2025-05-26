const Movie = require("../models/Movie.model");

const getStoredMovies = async () => {
  return await Movie.find().sort({ releaseDate: -1 }).limit(10);
};

const getMovieById = async (id) => {
  return await Movie.findById(id); 
};

module.exports = {
  getStoredMovies,
  getMovieById
};
