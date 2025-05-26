require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/database");
const tmdbService = require("../src/services/tmdb.service");

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  console.log("MongoDB conectado");

   try {
    const movies = await tmdbService.SaveRecentMovies();
    console.log(`Filmes TMDB salvos/atualizados: ${movies.length}`);
  } catch (err) {
    console.error("Erro ao buscar e salvar filmes TMDB na inicialização:", err);
  }

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});
