import React, { useState, useEffect, useRef } from 'react';
import { Button, IconButton, Modal, Row, Col } from 'rsuite';
import { PlayOutline, Plus, Heart, Check } from '@rsuite/icons';
import { FaListUl } from 'react-icons/fa';
import '../assets/styles/Details.css';
import { getMovieById } from '../services/movie.service';
import { getUserPlaylists, addMovieToPlaylist } from '../services/playlist.service';
import { getMockUser } from '../services/user.service';
import FullscreenPlayer from './FullscreenPlayer';

const Details = ({ open, onClose, trailerId }) => {
  const [trailerDetails, setTrailerDetails] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [addedToPlaylist, setAddedToPlaylist] = useState(false);
  const [playerState, setPlayerState] = useState({
    playing: true,
    played: 0,
    duration: 0,
    isPlaying: false,
  });

  const playerRef = useRef(null);

  useEffect(() => {
    if (!open || !trailerId) return;

    const fetchData = async () => {
      try {
        const trailer = await getMovieById(trailerId);
        setTrailerDetails(trailer);

        const user = await getMockUser();
        setUserId(user._id);

        const userPlaylists = await getUserPlaylists(user._id);
        setPlaylists(userPlaylists);

        setAddedToPlaylist(false); // Resetar ao abrir novo trailer
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, [open, trailerId]);

  const handlePlay = () => {
    setIsPlayerOpen(true);
    setPlayerState((prev) => ({ ...prev, isPlaying: true, playing: true }));
  };

  const toggleFavorite = () => {
    setFavorited(!favorited);
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await addMovieToPlaylist(playlistId, trailerId);
      setPlaylistModalOpen(false);
      setAddedToPlaylist(true);
    } catch (error) {
      console.error('Erro ao adicionar à playlist:', error);
    }
  };

  return (
    <Row style={{ marginTop: 20 }}>
      <Col lg={24}>
        <Modal
          size="lg"
          open={open}
          onClose={onClose}
          closable
          className="details-modal"
        >
          <Modal.Header />
          <Modal.Body>
            <Row align="middle" gutter={20}>
              <Col xs={24} md={12} className='modal-content-center'>
                {trailerDetails?.backdrop ? (
                  <img
                    src={`https://image.tmdb.org/t/p/original${trailerDetails.backdrop}`}
                    alt={trailerDetails?.title}
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: 200,
                      backgroundColor: '#ccc',
                      borderRadius: 8,
                    }}
                  />
                )}
              </Col>

              <Col xs={24} md={12} className='modal-content-center'>
                <h2>{trailerDetails?.title || 'Título do Filme'}</h2>
                <p>{trailerDetails?.overview || 'Descrição não disponível.'}</p>

                <div>
                  <Button
                    appearance="primary"
                    startIcon={<PlayOutline />}
                    onClick={handlePlay}
                    style={{ marginRight: 8 }}
                  >
                    Assistir
                  </Button>
                  <IconButton
                    icon={
                      addedToPlaylist ? (
                        <Check style={{ color: 'white' }} />
                      ) : (
                        <Plus />
                      )
                    }
                    circle
                    title="Adicionar à playlist"
                    style={{
                      marginRight: 8,
                      backgroundColor: addedToPlaylist ? '#e50914' : undefined,
                    }}
                    onClick={() => {
                      if (!addedToPlaylist) {
                        setPlaylistModalOpen(true);
                      }
                    }}
                  />
                  <IconButton
                    icon={<Heart />}
                    circle
                    appearance={favorited ? 'primary' : 'default'}
                    color={favorited ? 'red' : undefined}
                    title="Favoritar"
                    onClick={toggleFavorite}
                  />
                </div>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </Col>

      {isPlayerOpen && (
        <Col lg={24} style={{ marginTop: 20 }}>
          <FullscreenPlayer
            trailerKey={trailerDetails?.trailerKey}
            playerRef={playerRef}
            playerState={playerState}
            setPlayerState={setPlayerState}
            onClosePlayer={() => setIsPlayerOpen(false)}
          />
        </Col>
      )}

      <Modal
        size="xs"
        open={playlistModalOpen}
        onClose={() => setPlaylistModalOpen(false)}
        header={false}
      >
        <Modal.Body>
          <h5 style={{ textAlign: 'center', marginBottom: 10 }}>Adicionar à playlist</h5>

          {playlists?.length === 0 ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '10px',
              }}
            >
              Nenhuma playlist criada ainda.
            </div>
          ) : (
            playlists.map((playlist) => (
              <Col
                key={playlist?._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  padding: '6px 0',
                }}
                onClick={() => handleAddToPlaylist(playlist._id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <FaListUl style={{ marginRight: 8 }} />
                  {playlist?.name}
                </div>
              </Col>
            ))
          )}
        </Modal.Body>
      </Modal>
    </Row>
  );
};

export default Details;
