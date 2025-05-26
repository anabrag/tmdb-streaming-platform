import React, { useEffect, useState } from 'react';
import { getPlaylistById, removeMovieFromPlaylist } from '../services/playlist.service';
import 'rsuite/dist/rsuite.min.css';
import { FiTrash2 } from 'react-icons/fi';

const MoviePlaylist = ({ playlistId }) => {
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const data = await getPlaylistById(playlistId);
        setPlaylist(data);
      } catch (err) {
        console.error("Erro ao buscar a playlist:", err);
        setError('Erro ao carregar playlist');
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) {
      fetchPlaylist();
    }
  }, [playlistId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleRemoveTrailer = async (trailerId) => {
    if (!window.confirm('Tem certeza que deseja remover este filme da playlist?')) {
      return;
    }

    try {
      await removeMovieFromPlaylist(playlistId, trailerId);
      setPlaylist((prev) => ({
        ...prev,
        trailers: prev.trailers.filter((t) => t._id !== trailerId),
      }));
    } catch (err) {
      console.error("Erro ao remover o trailer:", err);
      alert('Falha ao remover o filme. Tente novamente.');
    }
  };

  if (loading) {
    return <div style={{ color: "#fff", padding: 20 }}>Carregando...</div>;
  }

  if (error) {
    return <div style={{ color: "red", padding: 20 }}>{error}</div>;
  }

  if (!playlist) {
    return <div style={{ color: "#fff", padding: 20 }}>Playlist não encontrada.</div>;
  }

  const movies = playlist.trailers || [];

  return (
    <div style={{ backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(to bottom, #e50914, #121212)', padding: '32px 24px', display: 'flex', gap: '24px' }}>
        <div style={{ width: '232px', height: '232px', backgroundColor: '#e50914', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '72px', fontWeight: 'bold' }}>
          🎬
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>Playlist</div>
          <h1 style={{ fontSize: '72px', fontWeight: '900', margin: 0 }}>{playlist.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', color: '#b3b3b3', marginTop: '12px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#DC143C' }}></div>
            <span>{playlist.userId || "Usuário"} • {movies.length} filmes</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '24px', gap: '24px' }}>
        <button style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#1DB954', color: '#fff', fontSize: '24px', border: 'none', cursor: 'pointer' }}>▶</button>
        <button style={{ marginLeft: 'auto', backgroundColor: 'transparent', color: '#b3b3b3', border: 'none', fontSize: '16px', cursor: 'pointer' }}>Lista</button>
      </div>

      <div style={{ padding: '0 24px 40px 24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#b3b3b3', textAlign: 'left', fontSize: '14px', borderBottom: '1px solid #282828' }}>
              <th style={{ width: '32px' }}>#</th>
              <th style={{ width: '40%' }}>Título</th>
              <th style={{ width: '20%' }}>Adicionado em</th>
              <th style={{ width: '15%' }}>Lançamento</th>
              <th style={{ width: '10%', textAlign: 'right' }}>Nota</th>
              <th style={{ width: '10%', textAlign: 'center' }}>Editar</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie, index) => (
              <tr key={movie._id || index} style={{ borderBottom: '1px solid #282828', height: '72px', color: '#fff', fontSize: '14px' }}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>

                <td style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={movie.poster ? `https://image.tmdb.org/t/p/w200${movie.poster}` : 'https://via.placeholder.com/50x50'}
                    alt={movie.title}
                    style={{ width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover' }}
                  />
                  <div>{movie.title}</div>
                </td>

                <td style={{ verticalAlign: 'middle' }}>{formatDate(movie.updatedAt)}</td>

                <td style={{ verticalAlign: 'middle' }}>{movie.releaseDate}</td>

                <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>{movie.voteAverage.toFixed(1)}</td>

                <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', verticalAlign: 'middle' }}>
                  <button
                    onClick={() => handleRemoveTrailer(movie._id)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                    }}
                    title="Remover filme"
                  >
                    <FiTrash2 size={20} color="#ff4d4f" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MoviePlaylist;
