import React, { useEffect, useState } from 'react';
import { Container, Header, Content, FlexboxGrid, Panel, Col } from 'rsuite';
import { getPlaylistById, removeMovieFromPlaylist } from '../../services/playlist.service';
import { FiTrash2 } from 'react-icons/fi';
import './playlist.css';

const MoviePlaylist = ({ playlistId }) => {
  const [playlist, setPlaylist] = useState(null);

  const fetchPlaylist = async (id) => {
    try {
      const data = await getPlaylistById(id);
      setPlaylist(data);
    } catch (err) {
      console.error("Erro ao buscar a playlist:", err);
    }
  };

  useEffect(() => {
    if (!playlistId) return;
    fetchPlaylist(playlistId);
  }, [playlistId]);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail.playlistId === playlistId) {
        fetchPlaylist(e.detail.playlistId);
      }
    };
    window.addEventListener('playlistUpdated', handleUpdate);
    return () => window.removeEventListener('playlistUpdated', handleUpdate);
  }, [playlistId]);

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString('pt-BR') : '';

  const handleRemoveMovie = async (movieId) => {
    try {
      await removeMovieFromPlaylist(playlistId, movieId);
      setPlaylist((playlist) => ({
        ...playlist,
        movies: playlist?.movies?.filter((m) => m?._id !== movieId) || [],
      }));
    } catch (err) {
      console.error("Erro ao remover o filme:", err);
      alert('Falha ao remover o filme. Tente novamente.');
    }
  };

  const movies = playlist?.movies || [];

  return (
    <Container className="playlist-container">
      <Header className="playlist-header">
        <FlexboxGrid align="middle">
          <FlexboxGrid.Item lg={6}>
            <Panel shaded className="playlist-cover" bordered>
              🎬
            </Panel>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item lg={18}>
            <div className="playlist-info">
              <div className="playlist-type">Playlist</div>
              <h1 className="playlist-title">{playlist?.name || 'Sem nome'}</h1>
              <div className="playlist-meta">
                <span>• {movies.length} {movies.length === 1 ? 'filme' : 'filmes'}</span>
              </div>
            </div>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Header>

      <Content className="playlist-table-container">
        <table className="playlist-table">
          <Col md={1}>#</Col>
          <Col md={6}>Título</Col>
          <Col md={4}>Adicionado em</Col>
          <Col md={4}>Lançamento</Col>
          <Col md={4}>Nota</Col>
          <Col md={4}>Remover</Col>
          {movies.map((movie, index) => (
            <tr key={movie?._id || index}>
              <Col md={1}>{index + 1}</Col>
              <Col md={6} className="movie-title">
                <img
                  src={movie?.poster ? `https://image.tmdb.org/t/p/w200${movie.poster}` : 'https://via.placeholder.com/50x50'}
                  alt={movie?.title || 'Sem título'}
                  className="movie-poster"
                />
                <div>{movie?.title || 'Sem título'}</div>
              </Col>
              <Col md={4}>{formatDate(movie?.createdAt)}</Col>
              <Col md={4}>{movie?.releaseDate || 'N/A'}</Col>
              <Col md={4}>{movie?.voteAverage?.toFixed(1) || '-'}</Col>
              <Col md={4}>
                <button
                  className="remove-button"
                  onClick={() => handleRemoveMovie(movie?._id)}
                  title="Remover filme"
                >
                  <FiTrash2 size={20} color="#ff4d4f" />
                </button>
              </Col>
            </tr>
          ))}
        </table>
      </Content>
    </Container>
  );
};

export default MoviePlaylist;
