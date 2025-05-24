import React from 'react';
import { Container, Header, Content, Footer } from 'rsuite';

function App() {
  return (
    <Container>
      <Header><h2 style={{ padding: '1rem' }}>Movie Trailers App</h2></Header>
      <Content style={{ padding: '1rem' }}>
        Conteúdo inicial
      </Content>
      <Footer style={{ textAlign: 'center', padding: '1rem' }}>
        © 2025
      </Footer>
    </Container>
  );
}

export default App;