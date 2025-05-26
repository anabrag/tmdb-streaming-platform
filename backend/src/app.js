const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/user.routes"));
app.use("/api", require("./routes/movie.routes"));
app.use("/api", require("./routes/tmdb.routes"));
app.use("/api", require("./routes/playlist.routes"));

app.get("/health", (req, res) => res.send("API OK"));

module.exports = app;
