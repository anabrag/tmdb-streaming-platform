const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
    tmdbId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    overview: String,
    poster: String,
    backdrop: String,
    releaseDate: String,
    voteAverage: Number,
    trailerKey: String,
}, { timestamps: true });

module.exports = mongoose.model("Movie", MovieSchema);
