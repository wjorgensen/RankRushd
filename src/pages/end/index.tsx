import styles from "./End.module.scss";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Overlay from "@/components/overlay/Overlay";

export default function Home() {

    const [showOverlay, setShowOverlay] = useState(false);
    const [showOverlay2, setShowOverlay2] = useState(true);
    const [overlayTrigger, setOverlayTrigger] = useState('');
    const [score, setScore] = useState(0);
    const [hscore, setHScore] = useState(0);
    const [message, setMessage] = useState('');
    const [gameRoute, setGameRoute] = useState('');
    const router = useRouter();

    const handleLogoClick = () => {
        setOverlayTrigger('logo');
        setShowOverlay(true);
    };

    const handleOverlayTransitionEnd = () => {
        const timer = setTimeout(() => {
            if (overlayTrigger === 'logo') {
                router.push('/');
            }
            else if (overlayTrigger === 'play') {
                router.push(gameRoute);
            }
            else if (overlayTrigger === 'settings') {
                router.push('/settings');
            }
        }, 500);
    
        return () => clearTimeout(timer);
    };

    const handleOverlayTransitionEnd2 = () => {
        setShowOverlay2(false);
    };


    useEffect(() => {
        const currentScore = parseInt(localStorage.getItem('score') || '0', 10);
        const highscore = parseInt(localStorage.getItem('highscore') || '0', 10);
        setScore(currentScore);
        setHScore(highscore);

        if (currentScore >= highscore) {
            setMessage('That\'s a PR!');
        } else if (currentScore >= 5) {
            setMessage('Not Bad!');
        } else {
            setMessage('Better luck next time!');
        }

        setGameRoute(localStorage.getItem('gameRoute') || '/game?hints=OFF&numHints=1&difficulty=Average&lives=3');
    }, []);

    const handlePlayAgain = () => {
        setOverlayTrigger('play');
        setShowOverlay(true);
    }

    const handleSettings = () => {
        setOverlayTrigger('settings');
        setShowOverlay(true);
    }

    return (
        <>
            {showOverlay && <Overlay direction="down" onTransitionEnd={handleOverlayTransitionEnd} />}
            {showOverlay2 && <Overlay direction="up" onTransitionEnd={handleOverlayTransitionEnd2} />}
            <div className={styles.logo}>
            <button onClick={handleLogoClick}>
                <p>Rank Rushd</p>
            </button>
        </div>
        <div className={styles.main}>
            <h1>Score</h1>
            <p>{score}</p>
            <h2>{message}</h2>
            <div className={styles.theButtons}>
                <button onClick={handlePlayAgain}>Play Again</button>
                <button className={styles.settingsB} onClick={handleSettings}>Settings</button>
            </div>
        </div>
        <div className={styles.highscore}>
            <h1>High Score</h1>
            <p>{hscore}</p>
        </div>
        </>
    );
}