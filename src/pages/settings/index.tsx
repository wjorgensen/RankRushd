import styles from "./Settings.module.scss"
import InfoIcon from "@/components/info-icon/InfoIcon";

export default function Home() {
    return (
        <>
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
                        <InfoIcon tooltipText="Hello brother"></InfoIcon>
                        <p>Hints</p>
                    </div>
                </div>
            </div>
            <div className={styles.play}>
                <button>PLAY</button>
            </div>        
        </>
    );
}