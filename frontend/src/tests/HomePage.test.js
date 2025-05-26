import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../pages/HomePage';
import '@testing-library/jest-dom';

jest.mock('../services/user.service', () => ({
  getMockUser: jest.fn(() => Promise.resolve({ _id: 'user123' })),
}));

jest.mock('../services/playlist.service', () => ({
  getUserPlaylists: jest.fn(() => Promise.resolve([])),
  deletePlaylist: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('../services/movie.service', () => ({
  getMovies: jest.fn(() => Promise.resolve([])),
}));

jest.mock('../components/CreatePlaylist/CreatePlaylist.component', () => () => <div data-testid="create-playlist-modal" />);
jest.mock('../components/DetailsFilm/Details.component', () => () => <div data-testid="details-component" />);
jest.mock('../components/Playlist/Playlist.componente', () => () => <div data-testid="playlist-component" />);

describe('HomePage Component', () => {
  it('renderiza os componentes principais', async () => {
    render(<HomePage />);

    expect(await screen.findByText('Sua biblioteca')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /criar playlist/i })).toBeInTheDocument();
  });
});
