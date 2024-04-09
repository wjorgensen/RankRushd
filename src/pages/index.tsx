import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Overlay from '@/components/overlay/Overlay';
import styles from "@/styles/Home.module.scss";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

export default function Home() {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const router = useRouter();

  const handleMouseDown = () => {
    setIsZoomed(true);
  };

  const handleMouseUp = () => {
    setIsZoomed(false);
    setIsZoomedIn(true);
  };

  const handleOverlayTransitionEnd = () => {
    setShowOverlay(false);
  };

  useEffect(() => {
    if (isZoomedIn) {
      const timer = setTimeout(() => {
        router.push('/settings');
      }, 3200); 

      return () => clearTimeout(timer);
    }
  }, [isZoomedIn, router]);

  return (
    <div className={`${styles.main} ${isZoomed ? styles.zoomed : ''} ${isZoomedIn ? styles.zoomedIn : ''}`}>
      <Analytics />
      <SpeedInsights />
      {showOverlay && <Overlay direction="up" onTransitionEnd={handleOverlayTransitionEnd} />}
      <div className={styles.backgroundImage}></div>
      <div className={styles.content}>
        <div>
          <h1>Rank Rushd</h1>
        </div>
        <button
          className={styles.play}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
        >
          PLAY
        </button>
        <p className={styles.link}>Directed by <a href="https://twitter.com/wezabis" target=" ">Wezabis</a></p>
      </div>
      <div className={styles.mobileSection}>
        <img src="mobile.png"></img>
      </div>
    </div>
  );
}