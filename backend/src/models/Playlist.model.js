const mongoose = require("mongoose");
const { Schema } = mongoose;

const PlaylistSchema = new Schema({
    name: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    movies: [ { type: Schema.Types.ObjectId, ref: 'Movie' } ]
}, {timestamps: true});

module.exports = mongoose.model("Playlist", PlaylistSchema);