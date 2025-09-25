import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Button, Loader, Slider } from 'rsuite';
import { FaVolumeUp, FaVolumeMute, FaPause, FaPlay, FaForward, FaBackward } from 'react-icons/fa';

import { getMovieById } from '../services/movie.service';

const FullscreenPlayer = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isMuted, setIsMuted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const playerRef = useRef(null);

  useEffect(() => {
    async function fetchMovie() {
      setLoading(true);
      try {
        const data = await getMovieById(movieId);
        setMovie(data);
      } catch (err) {
        console.error('Erro ao carregar o filme:', err);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [movieId]);

  const trailerKey = movie?.trailerKey;

  const handleTogglePlay = () => {
    setPlaying((playing) => !playing);
  };

  const handleToggleMute = () => {
    setIsMuted((muted) => !muted);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleSkipBackward = () => {
    const newTime = Math.max(playedSeconds - 10, 0);
    setPlayedSeconds(newTime);
    playerRef.current.seekTo(newTime);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(playedSeconds + 10, durationSeconds);
    setPlayedSeconds(newTime);
    playerRef.current.seekTo(newTime);
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayedSeconds(state.playedSeconds);
    }
  };

  const handleDuration = (duration) => {
    setDurationSeconds(duration);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh > 0) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const handleSeekChange = (value) => {
    setPlayedSeconds(value);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (value) => {
    setSeeking(false);
    playerRef.current.seekTo(value);
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
        <Loader content="Carregando trailer..." size="lg" />
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'black', zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      color: 'white',
    }}>
      {trailerKey ? (
        <>
          <ReactPlayer
            ref={playerRef}
            url={`https://www.youtube.com/watch?v=${trailerKey}`}
            playing={playing}
            muted={isMuted}
            controls={false}
            width="100%"
            height="100%"
            onProgress={handleProgress}
            onDuration={handleDuration}
          />

          <div style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <Slider
              min={0}
              max={durationSeconds}
              value={playedSeconds}
              onChange={handleSeekChange}
              onChangeStart={handleSeekMouseDown}
              onChangeEnd={handleSeekMouseUp}
              style={{ width: '100%' }}
            />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: 14, marginTop: 4 }}>
              <span>{formatTime(playedSeconds)}</span>
              <span>{formatTime(durationSeconds)}</span>
            </div>

            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 20, alignItems: 'center' }}>
              <Button appearance="primary" circle onClick={handleSkipBackward} title="Voltar 10 segundos">
                <FaBackward />
              </Button>

              <Button appearance="primary" circle onClick={handleTogglePlay} title={playing ? 'Pausar' : 'Play'}>
                {playing ? <FaPause /> : <FaPlay />}
              </Button>

              <Button appearance="primary" circle onClick={handleSkipForward} title="Avançar 10 segundos">
                <FaForward />
              </Button>

              <Button appearance="primary" circle onClick={handleToggleMute} title={isMuted ? 'Desmutar' : 'Mutar'}>
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div style={{ color: 'white', fontSize: 24 }}>
          Trailer indisponível
          <Button style={{ marginTop: 20 }} onClick={handleClose}>Voltar</Button>
        </div>
      )}
    </div>
  );
};

export default FullscreenPlayer;
