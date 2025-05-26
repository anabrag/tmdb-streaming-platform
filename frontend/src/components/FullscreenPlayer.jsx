import React, { useRef } from 'react';
import { Button } from 'rsuite';
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay } from 'react-icons/fa';
import ReactPlayer from 'react-player';

const FullscreenPlayer = ({ trailerKey, playerState, setPlayerState, isMuted, onClosePlayer }) => {
  const playerRef = useRef(null);

  const skipSeconds = (amount) => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + amount, 'seconds');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div
      className="fullscreen-player"
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'black', zIndex: 9999 }}
    >
      <ReactPlayer
        ref={playerRef}
        url={`https://www.youtube.com/watch?v=${trailerKey}`}
        playing={playerState.playing}
        muted={isMuted}
        width="100%"
        height="100%"
        onProgress={({ playedSeconds }) => setPlayerState(prev => ({ ...prev, played: playedSeconds }))}
        onDuration={duration => setPlayerState(prev => ({ ...prev, duration }))}
        config={{
          youtube: {
            playerVars: {
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              controls: 0,
              iv_load_policy: 3,
            },
          },
        }}
      />

      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <Button onClick={onClosePlayer}>Fechar ✖</Button>
      </div>

      <div style={{ position: 'absolute', bottom: 50, width: '90%', left: '5%', color: 'white' }}>
        <input
          type="range"
          min={0}
          max={playerState.duration || 0}
          value={playerState.played || 0}
          onChange={e => playerRef.current.seekTo(parseFloat(e.target.value), 'seconds')}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 14 }}>
          <span>{formatTime(playerState.played || 0)}</span>
          <span>{formatTime(playerState.duration || 0)}</span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 10,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 10,
          color: 'white',
        }}
      >
        <Button onClick={() => skipSeconds(-10)} appearance="default">
          <FaChevronLeft />
        </Button>
        <Button onClick={() => setPlayerState(prev => ({ ...prev, playing: !prev.playing }))} appearance="ghost">
          {playerState.playing ? <FaPause /> : <FaPlay />}
        </Button>
        <Button onClick={() => skipSeconds(10)} appearance="default">
          <FaChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default FullscreenPlayer;
