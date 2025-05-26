import React from 'react';
import { Container, Content, Footer } from 'rsuite';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from '../src/pages/HomePage';
import MoviePlaylist from '../src/components/Playlist/Playlist.componente';
import FullscreenPlayer from '../src/pages/FullscreenPlayer.page';

function App() {
  return (
    <Router>
      <Container>
        <Content style={{ padding: '1rem' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/playlist/:playlistId" element={<MoviePlaylist />} />
             <Route path="/player/:movieId" element={<FullscreenPlayer />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center', padding: '1rem' }}>
          © 2025
        </Footer>
      </Container>
    </Router>
  );
}

export default App;
