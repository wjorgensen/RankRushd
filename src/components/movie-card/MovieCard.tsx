import { useState } from 'react';
import styles from "./MovieCard.module.scss";

interface MovieCardProps {
  imageUrl: string;
  movieName: string;
  rating: number;
  director: string;
  cast: string;
  totalWatched: number;
  hints: boolean;
  onHintUsed: () => void;
  onGuess: (guess: 'higher' | 'lower') => void;
}

export default function MovieCard({
  imageUrl,
  movieName,
  rating,
  director,
  cast,
  totalWatched,
  hints,
  onHintUsed,
  onGuess,
}: MovieCardProps) {
  const [isRevealed, setIsRevealed] = useState({
    cast: false,
    totalWatched: false,
  });

  const handleReveal = (field: 'cast' | 'totalWatched') => {
    setIsRevealed((prevState) => ({
      ...prevState,
      [field]: true,
    }));
    onHintUsed();
  };

  return (
    <div className={styles.movieCard}>
      <img src={imageUrl} alt={movieName} className={styles.movieImage} />
      <h2 className={styles.movieName}>{movieName}</h2>
      {!hints ? (
        <>
          <p className={styles.director}>Director: {director}</p>
          {isRevealed.cast ? (
            <p className={styles.cast}>Cast: {cast}</p>
          ) : (
            <div className={styles.revealBox} onClick={() => handleReveal('cast')}>
              <p>Cast: ???</p>
            </div>
          )}
          {isRevealed.totalWatched ? (
            <p className={styles.totalWatched}>Total Watched: {totalWatched}</p>
          ) : (
            <div className={styles.revealBox} onClick={() => handleReveal('totalWatched')}>
              <p>Total Watched: ???</p>
            </div>
          )}
        </>
      ) : (
        <div className={styles.buttonsContainer}>
          <button onClick={() => onGuess('higher')}>Higher</button>
          <button onClick={() => onGuess('lower')}>Lower</button>
        </div>
      )}
    </div>
  );
}