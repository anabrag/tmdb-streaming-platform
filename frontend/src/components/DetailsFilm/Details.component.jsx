import React, { useState, useEffect } from 'react';
import { Button, IconButton, Modal, Row, Col } from 'rsuite';
import { PlayOutline, Plus, Check } from '@rsuite/icons';
import { FaListUl } from 'react-icons/fa';
import './Details.css';
import { getMovieById } from '../../services/movie.service';
import { getUserPlaylists, addMovieToPlaylist } from '../../services/playlist.service';
import { getMockUser } from '../../services/user.service';

const Details = ({ open, onClose, trailerId }) => {
  const [trailerDetails, setTrailerDetails] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [addedToPlaylist, setAddedToPlaylist] = useState(false);


  useEffect(() => {
    if (!open || !trailerId) return;

    const fetchData = async () => {
      try {
        const trailer = await getMovieById(trailerId);
        setTrailerDetails(trailer);

        const user = await getMockUser();
        const userPlaylists = await getUserPlaylists(user._id);
        setPlaylists(userPlaylists);

        const alreadyInPlaylist = userPlaylists.some((playlist) =>
          playlist.movies?.some((movie) => movie.tmdbId === trailer.tmdbId)
        );

        setAddedToPlaylist(alreadyInPlaylist);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, [open, trailerId]);

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await addMovieToPlaylist(playlistId, trailerId);
      setPlaylistModalOpen(false);
      setAddedToPlaylist(true);

      const event = new CustomEvent('playlistUpdated', { detail: { playlistId } });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Erro ao adicionar à playlist:', error);
    }
  };

  return (
    <Row style={{ marginTop: 20 }}>
      <Col lg={24}>
        <Modal
          size="md"
          open={open}
          onClose={onClose}
          closable
          className="details-modal"
        >
          <Modal.Header />
          <Modal.Body>
            <Row align="middle" gutter={20}>
              <Col md={10} className="modal-content-center">
                {trailerDetails?.backdrop ? (
                  <img
                    src={`https://image.tmdb.org/t/p/original${trailerDetails.backdrop}`}
                    alt={trailerDetails?.title}
                    style={{ width: '100%', borderRadius: 8, height: "100%" }}
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

              <Col xs={24} md={12} className="modal-content-center">
                <h2>{trailerDetails?.title || 'Título do Filme'}</h2>
                <p>{trailerDetails?.overview || 'Descrição não disponível.'}</p>

                <div>
                    <Button appearance="primary" startIcon={<PlayOutline />} href={`/player/${trailerId}`} disabled={!trailerDetails?.trailerKey} target="_blank" rel="noopener noreferrer">
                      Assistir
                    </Button>
                    <IconButton icon={addedToPlaylist ? (<Check style={{color: 'white'}} />) : (<Plus />)}
                      circle
                      title="Adicionar à playlist"
                      style={{ marginRight: 8, backgroundColor: addedToPlaylist ? '#e50914' : undefined}}
                      onClick={() => {if (!addedToPlaylist) {setPlaylistModalOpen(true)}}}
                    />
                </div>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </Col>

      <Modal
        size="xs"
        open={playlistModalOpen}
        onClose={() => setPlaylistModalOpen(false)}
        header={false}
      >
        <Modal.Body>
          <h5 style={{ textAlign: 'center', marginBottom: 10 }}>
            Adicionar à playlist
          </h5>

          {playlists?.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: 10 }}>
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
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
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
