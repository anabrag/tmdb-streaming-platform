import React, { useState } from 'react';
import { Modal, Button, Input } from 'rsuite';
import { createPlaylist } from '../../services/playlist.service';
import './CreatePlaylist.css';

const CreatePlaylistModal = ({ open, onClose, userId, onCreate }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      const playlist = await createPlaylist(name, userId);
      onCreate?.(playlist); 
      onClose();
      setName('');
    } catch (err) {
      console.error('Erro ao criar playlist', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      <Modal.Header>
        <Modal.Title>Criar nova playlist</Modal.Title>
      </Modal.Header>
      <Modal.Body className="create-playlist-body">
        <Input
          placeholder="Nome da playlist"
          value={name}
          onChange={setName}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCreate} loading={loading} appearance="primary">
          Criar
        </Button>
        <Button onClick={onClose} appearance="subtle">
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreatePlaylistModal;
