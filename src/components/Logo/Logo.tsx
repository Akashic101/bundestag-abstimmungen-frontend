import React from 'react';
import logoImg from '../../assets/images/logo.png'
import styles from './Logo.module.css';

interface LogoProps {
  width?: string;
  height?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 'auto' }) => {
  return (
    <div className={styles.logoContainer}>
      <img
        src={logoImg}
        className={styles.logo}
        alt="Logo"
        style={{ width: width }}
      />
      <h1 className={styles.title}>Bundestag Tracker</h1>
    </div>
  );
};

export default Logo;
