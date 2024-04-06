import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Overlay from '@/components/Overlay';
import styles from "@/styles/Home.module.scss";

export default function Home() {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const router = useRouter();

  const handleMouseDown = () => {
    setIsZoomed(true);
  };

  const handleMouseUp = () => {
    setIsZoomed(false);
    setIsZoomedIn(true);
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
      <Overlay/>
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
    </div>
  );
}