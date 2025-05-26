import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Button, Notification, toaster, Panel } from 'rsuite';
import { FaPlus, FaListUl, FaTrash, FaPlay, FaInfoCircle, FaVolumeUp, FaVolumeMute, FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa';

import CreatePlaylistModal from '../components/CreatePlaylist/CreatePlaylist.component';
import Details from '../components/DetailsFilm/Details.component';
import MoviePlaylist from '../components/Playlist/Playlist.componente';

import { getMockUser } from '../services/user.service';
import { getUserPlaylists, deletePlaylist } from '../services/playlist.service';
import { getMovies } from '../services/movie.service';

import '../assets/styles/HomePage.css';

const HomePage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [latestMovie, setLatestMovie] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const playerRef = useRef(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const [movies, setMovies] = useState([]);
  const [recommendedDetailsOpen, setRecommendedDetailsOpen] = useState(false);
  const [recommendedMovieId, setRecommendedMovieId] = useState(null);

  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getMockUser();
        setUserId(user?._id ?? null);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;
    async function fetchPlaylists() {
      try {
        const data = await getUserPlaylists(userId);
        setPlaylists(data ?? []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchPlaylists();
  }, [userId]);

  useEffect(() => {
    async function loadLatestMovie() {
      try {
        const allMovies = await getMovies();

        if (!allMovies?.length) return;
        const recent = allMovies
          .filter(m => m?.trailerKey)
          .sort((a, b) => new Date(b?.releaseDate) - new Date(a?.releaseDate))[0];

        if (recent) {
          setLatestMovie(recent);
        }

      } catch (error) {
        toaster.push(
          <Notification type="error" header="Trailer Error" closable>
            Falha ao carregar trailer. Tente novamente mais tarde.
          </Notification>,
          { placement: 'topEnd' }
        );
      }
    }

    loadLatestMovie();
  }, []);

  useEffect(() => {
    async function loadMovies() {
      try {
        const moviesFromApi = await getMovies();
        setMovies(moviesFromApi ?? []);
      } catch (error) {
        console.error(error);
      }
    }

    loadMovies();
  }, []);

  const handleDetailsClick = () => {
    if (latestMovie?._id) {
      setSelectedMovieId(latestMovie._id);
      setIsDetailsOpen(true);
    }
  };

  const handleToggleMute = () => setIsMuted(m => !m);

  const scrollByOffset = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: offset,
        behavior: 'smooth',
      });
    }
  };

  const handlePosterClick = (movieId) => {
    setRecommendedMovieId(movieId);
    setRecommendedDetailsOpen(true);
  };

  const handleBackFromPlaylist = () => {
    setSelectedPlaylistId(null);
  };

  const handleDelete = async (playlistId) => {
    if (!window.confirm('Tem certeza que deseja apagar essa playlist?')) return;

    try {
      const success = await deletePlaylist(playlistId);

      if (success) {
        setPlaylists(playlist => playlist?.filter(p => p._id !== playlistId));
        if (selectedPlaylistId === playlistId) {
          setSelectedPlaylistId(null);
        }
      } else {
        alert('Erro ao apagar a playlist.');
      }
    } catch {
      alert('Erro ao apagar a playlist.');
    }
  };

  const handleOpenPlaylist = (playlistId) => {
    setSelectedPlaylistId(playlistId);
  };

  const handlePlaylistCreated = (newPlaylist) => {
    setPlaylists(playlist => [newPlaylist, ...playlist]);
    setModalOpen(false);
  };

  return (
    <Container className="homepage-container" fluid>
      <Container className="main-layout" fluid>
        <Row className="full-height-row">
          <Col lg={4} md={5} sm={6} xs={24} className="sidebar-col">
            <Container>
              <h4 className="sidebar-title">Sua biblioteca</h4>
              <Button
                appearance="primary"
                className="create-playlist-btn"
                onClick={() => setModalOpen(true)}
              >
                <FaPlus /> Criar playlist
              </Button>

              {playlists.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                  Nenhuma playlist criada ainda.
                </div>
              ) : (
                playlists.map(playlist => (
                  <Col
                    key={playlist?._id ?? Math.random()}
                    className="playlist"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 8,
                    }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => handleOpenPlaylist(playlist?._id)}
                    >
                      <FaListUl style={{ marginRight: 8 }} /> {playlist?.name ?? 'Sem nome'}
                    </div>
                    <FaTrash
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDelete(playlist?._id)}
                    />
                  </Col>
                ))
              )}
              <CreatePlaylistModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                userId={userId}
                onCreate={handlePlaylistCreated}
              />
            </Container>
          </Col>

          <Col lg={20} md={19} sm={18} xs={24} className="content-col">
            {selectedPlaylistId ? (
              <div>
                <Button
                  appearance="link"
                  onClick={handleBackFromPlaylist}
                  style={{
                    marginBottom: 10,
                    padding: 0,
                    color: 'inherit',    
                    boxShadow: 'none',      
                    outline: 'none',         
                  }}
                  onFocus={(e) => e.target.style.outline = 'none'}  
                  onBlur={(e) => e.target.style.outline = 'none'}
                >
                  <FaArrowLeft /> Voltar
                </Button>
                <MoviePlaylist playlistId={selectedPlaylistId} />
              </div>
            ) : (
              <Row className="player-area">
                {latestMovie && (
                  <div className="main-player-container">
                    <div
                      className="react-player-wrapper"
                      style={{
                      height: "100%",
                      position: 'relative',
                      backgroundImage: `url(https://image.tmdb.org/t/p/w1280${latestMovie?.backdrop ?? ''})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 12,
                      minHeight: 350,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                    }}
                    >
                    </div>
                    <div className="main-player-content">
                      <h2 className="main-player-title">{latestMovie?.title ?? 'Título indisponível'}</h2>
                      <div className="main-player-buttons-container">
                        <div className="main-player-buttons">
                          <a href={`/player/${latestMovie?._id}`}>
                            <Button appearance="primary" size="lg">
                              <FaPlay /> Assistir
                            </Button>
                          </a>
                          <Button appearance="default" size="lg" onClick={handleDetailsClick}>
                            <FaInfoCircle /> Mais informações
                          </Button>
                        </div>
                        <Button
                          size="lg"
                          appearance="default"
                          className="volume-button"
                          onClick={handleToggleMute}
                        >
                          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Row>
            )}
          </Col>

          <Col lg={24} md={19} sm={18} xs={24}>
            <Row>
              {recommendedMovieId && (
                <Details
                  open={recommendedDetailsOpen}
                  onClose={() => setRecommendedDetailsOpen(false)}
                  trailerId={recommendedMovieId}
                />
              )}
              <Container className="recommended-container">
                <h3 className="recommended-title">Recomendados</h3>
                <button
                  onClick={() => scrollByOffset(-300)}
                  className="recommended-arrow left"
                >
                  <FaChevronLeft />
                </button>
                <div className="recommended-scroll" ref={scrollRef}>
                  {movies.map(({ _id, title, poster }) => (
                    <div
                      key={_id ?? Math.random()}
                      className="recommended-item"
                      onClick={() => handlePosterClick(_id)}
                    >
                      <Panel bordered bodyFill>
                        <img
                          src={`https://image.tmdb.org/t/p/w300${poster ?? ''}`}
                          alt={title ?? 'Filme sem título'}
                          className="recommended-poster"
                        />
                      </Panel>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => scrollByOffset(300)}
                  className="recommended-arrow right"
                >
                  <FaChevronRight />
                </button>
              </Container>
            </Row>
          </Col>
        </Row>
      </Container>

      {selectedMovieId && (
        <Details
          open={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          trailerId={selectedMovieId}
        />
      )}
    </Container>
  );
};

export default HomePage;
