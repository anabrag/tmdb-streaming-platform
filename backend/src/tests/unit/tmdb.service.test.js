const axios = require('axios');
const { getRecentMoviesWithTrailers, getMovieVideos } = require('../../services/tmdb.service');

jest.mock('axios');

describe('tmdb service', () => {
  const mockGet = jest.fn();

  beforeAll(() => {
    axios.create.mockReturnValue({ get: mockGet });
  });

  beforeEach(() => {
    mockGet.mockReset();
  });

  it('deve retornar filmes com trailer do YouTube', async () => {
    mockGet.mockImplementation((url) => {
      if (url === '/movie/now_playing') {
        return Promise.resolve({
          data: {
            results: [
              { id: 1, title: 'Filme 1', overview: 'Descrição 1', poster_path: 'poster1.jpg', backdrop_path: 'backdrop1.jpg', release_date: '2024-01-01', vote_average: 7.5 },
              { id: 2, title: 'Filme 2', overview: 'Descrição 2', poster_path: 'poster2.jpg', backdrop_path: 'backdrop2.jpg', release_date: '2024-02-01', vote_average: 8.0 }
            ]
          }
        });
      }

      if (url === '/movie/1/videos') {
        return Promise.resolve({
          data: {
            results: [
              { type: 'Trailer', site: 'YouTube', key: 'abc123' },
              { type: 'Teaser', site: 'YouTube', key: 'teaser1' }
            ]
          }
        });
      }

      if (url === '/movie/2/videos') {
        return Promise.resolve({
          data: {
            results: [
              { type: 'Clip', site: 'YouTube', key: 'clip1' }
            ]
          }
        });
      }

      return Promise.resolve({ data: { results: [] } });
    });

    const moviesWithTrailers = await getRecentMoviesWithTrailers();

    expect(moviesWithTrailers.length).toEqual(20);
  });

  it('deve retornar vídeos do filme usando getMovieVideos', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        results: [
          { type: 'Trailer', site: 'YouTube', key: 'videoKey1' },
          { type: 'Clip', site: 'YouTube', key: 'videoKey2' }
        ]
      }
    });

    const videos = await getMovieVideos(123);
    expect(videos).toHaveLength(2);
    expect(videos[0].key).toBe('videoKey1');
  });

  it('deve lidar com erro na requisição de filmes recentes', async () => {
    mockGet.mockRejectedValueOnce(new Error('API indisponível'));

    await expect(getRecentMoviesWithTrailers()).rejects.toThrow('API indisponível');
  });

  it('deve retornar no máximo 10 filmes com trailer', async () => {
    const movies = [];

    for (let i = 1; i <= 15; i++) {
      movies.push({ id: i, title: `Filme ${i}`, overview: 'desc', poster_path: '', backdrop_path: '', release_date: '', vote_average: 0 });
    }

    mockGet.mockImplementation((url) => {
      if (url === '/movie/now_playing') {
        return Promise.resolve({ data: { results: movies } });
      }
      if (url.includes('/videos')) {
        return Promise.resolve({
          data: {
            results: [{ type: 'Trailer', site: 'YouTube', key: `key${url.match(/\d+/)[0]}` }]
          }
        });
      }
      return Promise.resolve({ data: { results: [] } });
    });

    const result = await getRecentMoviesWithTrailers();

    expect(result.length).toBe(20);
    expect(result[0].tmdbId).toBe(1);
    expect(result[9].tmdbId).toBe(10);
  });
});
