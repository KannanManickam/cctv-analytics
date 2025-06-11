// src/components/HlsPlayer.jsx
import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const HlsPlayer = ({ src, width = 640, height = 360 }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!src) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari support
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      width={width}
      height={height}
      controls
      autoPlay
      muted
      playsInline
    />
  );
};

export default HlsPlayer;
