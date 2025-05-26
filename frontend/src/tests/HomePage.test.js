import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '../pages/HomePage';

jest.mock('../services/user.service', () => ({
  getUser: jest.fn()
}));

jest.mock('../services/playlist.service', () => ({
  getUserPlaylists: jest.fn()
}));

jest.mock('../services/movie.service', () => ({
  getMovies: jest.fn()
}));

import * as userService from '../services/user.service';
import * as playlistService from '../services/playlist.service';
import * as movieService from '../services/movie.service';

describe('HomePage', () => {
  beforeEach(() => {
    userService.getUser.mockResolvedValue({ _id: '123', name: 'Carol' });
    playlistService.getUserPlaylists.mockResolvedValue([]);
    movieService.getMovies.mockResolvedValue([]);
  });

  test('renderiza componentes principais', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText(/sua biblioteca/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /criar playlist/i })).toBeInTheDocument();

    expect(screen.getByText(/nenhuma playlist criada ainda/i)).toBeInTheDocument();
  });
});
