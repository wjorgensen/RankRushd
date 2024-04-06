import styles from "./Settings.module.scss"
import InfoIcon from "@/components/info-icon/InfoIcon";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Overlay from '@/components/overlay/Overlay';

export default function Home() {
    const [selectedHints, setSelectedHints] = useState("ON");
    const [selectedNumHints, setSelectedNumHints] = useState("1");
    const [selectedDifficulty, setSelectedDifficulty] = useState("Casual");
    const [showOverlay, setShowOverlay] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [overlayTrigger, setOverlayTrigger] = useState('');
    const router = useRouter();

    const handleHintsClick = (value: string) => {
        setSelectedHints(value);
    };

    const handleNumHintsClick = (value: string) => {
        setSelectedNumHints(value);
    };

    const handleDifficultyClick = (value: string) => {
        setSelectedDifficulty(value);
    };

    const handleLogoClick = () => {
        setOverlayTrigger('logo');
        setShowOverlay(true);
    };

    const handlePlayClick = () => {
        setOverlayTrigger('play');
        setShowOverlay(true);
      };

    const handleOverlayTransitionEnd = () => {
        const timer = setTimeout(() => {
            if (overlayTrigger === 'logo') {
                router.push('/');
            } else if (overlayTrigger === 'play') {
                router.push('/game?hints=' + selectedHints + '&numHints=' + selectedNumHints+'&difficulty='+selectedDifficulty);
            }
          }, 500);
      
          return () => clearTimeout(timer);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
          setShowContent(true);
        }, 50);
    
        return () => clearTimeout(timer);
      }, []);

    return (
        <>
            {showOverlay && <Overlay direction="down" onTransitionEnd={handleOverlayTransitionEnd} />}
            <div className={`${styles.settingsContainer} ${showContent ? styles.show : ''}`}>
                <div className={styles.logo}>
                    <button onClick={handleLogoClick}>
                        <p>Rank Rushd</p>
                    </button>
                </div>
                <div className={styles.main}>
                    <div className={styles.left}>
                        <h1>How to play</h1>
                        <p>
                            It's pretty simple: guess whether the movie on the right has a higher Letterboxd
                            score than the movie on the left and try to build the longest streak possible
                            <br/><br/> Have fun!
                        </p>
                    </div>
                    <div className={styles.right}>
                        <h1>Game Settings</h1>
                        <div className={styles.hints}>
                            <InfoIcon tooltipText="Hints allow you to reveal the director, main actors, and number of veiwers"></InfoIcon>
                            <p>Hints</p>
                        </div>
                        <div className={styles.hintsOption}>
                            <button
                            className={selectedHints === "ON" ? styles.active : ""}
                            onClick={() => handleHintsClick("ON")}
                            >
                            ON
                            </button>
                            <button
                            className={selectedHints === "OFF" ? styles.active : ""}
                            onClick={() => handleHintsClick("OFF")}
                            >
                            OFF
                            </button>
                        </div>
                        <div
                        className={selectedHints === "OFF" ? styles.dissapear : styles.numHintsWrap}
                        >
                            <p>Number of Hints</p>
                            <div className={styles.numHintsOptions}>
                                <button
                                className={selectedNumHints === "1" ? styles.active : ""}
                                onClick={() => handleNumHintsClick("1")}
                                >
                                1
                                </button>
                                <button
                                className={selectedNumHints === "3" ? styles.active : ""}
                                onClick={() => handleNumHintsClick("3")}
                                >
                                3
                                </button>
                                <button
                                className={selectedNumHints === "5" ? styles.active : ""}
                                onClick={() => handleNumHintsClick("5")}
                                >
                                5
                                </button>
                                <button
                                className={`${selectedNumHints === "Infinite" ? styles.active : ""} ${
                                    selectedNumHints === "Infinite" ? styles.infiniteButton : ""
                                }`}
                                onClick={() => handleNumHintsClick("Infinite")}
                                >
                                Infinite
                                </button>
                            </div>
                        </div>
                        <p>Difficulty</p>
                        <div className={styles.difficultyOptions}>
                            <button
                            className={selectedDifficulty === "Casual" ? styles.active : ""}
                            onClick={() => handleDifficultyClick("Casual")}
                            >
                            Casual
                            </button>
                            <button
                            className={selectedDifficulty === "Average" ? styles.active : ""}
                            onClick={() => handleDifficultyClick("Average")}
                            >
                            Average
                            </button>
                            <button
                            className={selectedDifficulty === "Cinephile" ? styles.active : ""}
                            onClick={() => handleDifficultyClick("Cinephile")}
                            >
                            Cinephile
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.play}>
                    <button
                    onMouseUp={handlePlayClick}
                    onTouchEnd={handlePlayClick}
                    >PLAY</button>
                    <p className={styles.link}>Directed by <a href="https://twitter.com/wezabis" target=" ">Wezabis</a></p>
                </div>
            </div>        
        </>
    );
}