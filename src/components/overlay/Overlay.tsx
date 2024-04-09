import React, { useEffect, useState } from 'react';
import styles from './Overlay.module.scss';

interface OverlayProps {
  direction: 'down' | 'up';
  onTransitionEnd: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ direction, onTransitionEnd }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName === 'transform') {
      onTransitionEnd();
    }
  };

  return (
    <div
      className={`${styles.overlay} ${isVisible ? styles.visible : ''} ${
        direction === 'down' ? styles.down : styles.up
      }`}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className={styles.content}>
        <img src="curtain.png" alt="Curtain" />
      </div>
    </div>
  );
};

export default Overlay;