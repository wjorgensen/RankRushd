import React, { useEffect, useState } from 'react';
import styles from './Overlay.module.scss';

const Overlay = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${styles.overlay} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.content}>
        <img src="curtain.png" alt="Curtain" />
      </div>
    </div>
  );
};

export default Overlay;