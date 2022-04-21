import { Ref, useRef } from 'react';
import videojs from 'video.js';
import axios from 'axios';

export function usePlayerHandle() {
  const playerRef = useRef(null);

  const handlePlayerReady = (player: videojs.Player) => {
    // @ts-ignore
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      console.log('player is waiting');
      // player.log('player is waiting');
    });

    console.log(player.audioTracks());
    // console.log(player.controlBar.);

    player.on('dispose', () => {
      console.log('player will dispose');
      // player.log('player will dispose');
    });
  };

  return {
    playerRef,
    handlePlayerReady
  }
}

export function getVideoOptions(imageName: string): videojs.PlayerOptions {
  console.log('imageName', imageName)
  return {
    autoplay: false,
    playbackRates: [0.5, 1, 1.25, 1.5, 2],
    controls: true,
    width: 600,
    height: 400,
    // responsive: true,
    sources: [{
      src: 'http://localhost:9000/' + imageName,
      type: 'video/mp4'
    }]
  }
}
