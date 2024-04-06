import React from 'react';
import styles from './InfoIcon.module.scss';

interface InfoIconProps {
  tooltipText: string;
}

const InfoIcon: React.FC<InfoIconProps> = ({ tooltipText }) => {
  return (
    <div className={styles.infoIcon} data-tooltip={tooltipText}>
      <div className={styles.icon}>
        <span>i</span>
      </div>
    </div>
  );
};

export default InfoIcon;