import './App.css';
import { useRef, useEffect, FC } from 'react'
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoComponent: FC<{options: any, onReady?: any}> = ({options, onReady}: any) => {
  const videoRef = useRef(null);
  const playerRef = useRef<videojs.Player>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;

      if (!videoElement) return;

      // @ts-ignore
      const player = playerRef.current = videojs(videoElement, options, () => {
        onReady?.(player);
      });

      // You can update player in the `else` block here, for example:
    } else {
      playerRef.current.autoplay(options.autoplay);
      playerRef.current.src(options.sources);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.dispose();
        // @ts-ignore
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className='video-js vjs-big-play-centered' />
    </div>
  );
}

export default VideoComponent;
