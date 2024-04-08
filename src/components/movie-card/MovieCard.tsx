import { useState, useRef, useEffect } from 'react';
import classNames from 'classnames'; // For easier conditional class names
import styles from "./MovieCard.module.scss";

interface MovieCardProps {
  imageUrl: string;
  movieName: string;
  rating: number;
  director: string;
  cast: string;
  totalWatched: number;
  isOpen: boolean; 
  hints: boolean;
  onHintUsed?: () => boolean; 
  onGuess?: (guess: 'higher' | 'lower') => boolean; 
}

export default function MovieCard({
  imageUrl,
  movieName,
  rating,
  director,
  cast,
  totalWatched,
  isOpen,
  hints,
  onHintUsed,
  onGuess,
}: MovieCardProps) {
  const [isRevealed, setIsRevealed] = useState({
    director: false,
    cast: false,
    totalWatched: false,
  });

  const [reveal, setReveal] = useState("Use Hint")

  const handleReveal = (field: 'director' | 'cast' | 'totalWatched') => {
    if (onHintUsed) {
      const canReveal = onHintUsed();

      if(canReveal){
        setIsRevealed((prevState) => ({
          ...prevState,
          [field]: true,
        }));
      } else {
        setReveal("Out of Hints");
      }
    }
  };

  
  const [isAnimating, setIsAnimating] = useState(false);

  const handleGuess = (guess: 'higher' | 'lower') => {
    // Start the animation
    setIsAnimating(true);
  
    // Mock duration for the animation
    const animationDuration = 1000; // 1 second, adjust based on your CSS animation
  
    setTimeout(() => {
      setIsAnimating(false);
      // Here, you need to ensure the parent component can update the isOpen state
      // This could be done via a prop function like `onOpenChange(true)`
    }, animationDuration);
  
    if(onGuess){
      onGuess(guess);
    }
  };
  

  const cardClasses = classNames(styles.movieCard, {
    [styles.withHints]: !isOpen && hints,
  });

  const breakdownCast = (cast: string): [string, string, string] => {
    const cleanedCast = cast.slice(2, -2);
  
    const actors = cleanedCast.split("', '");
  
    const [actor1, actor2, actor3] = actors;
  
    return [actor1, actor2, actor3];
  };

  const [actor1, actor2, actor3] = breakdownCast(cast);

  const formatNumber = (num: number): string => {
    const numString = num.toString();
    const digits = numString.split('');
    const formattedDigits = [];

    for (let i = digits.length - 1; i >= 0; i--) {
      formattedDigits.unshift(digits[i]);

      if ((digits.length - i) % 3 === 0 && i !== 0) {
        formattedDigits.unshift(',');
      }
    }

    return formattedDigits.join('');
  };


  return (
    <div className={cardClasses}>
      <img src={imageUrl} alt={movieName} className={styles.movieImage} />
      <h2 className={styles.movieName}>{movieName}</h2>
      {isOpen ? (
        <>
          <div className={styles.rating}>
            <div>
              <p>{rating}</p>
            </div>
          </div>
          <div className={styles.statsWrapper}>
            <div className={styles.leftStats}>
              <div>
                <h1>Director</h1>
                <p className={styles.director}>{director}</p>
              </div>
              <div>
                <h1>Watches</h1>
                <p className={styles.totalWatched}>{formatNumber(totalWatched)}</p>
              </div>
            </div>
            <div className={styles.cast}>
              <h1>Cast</h1>
              <p>{actor1}</p>
              <p>{actor2}</p>
              <p>{actor3}</p>
            </div>
          </div>
        </>
      ) : (
        <>
          {hints && (
            <>
              <div className={classNames(styles.statsWrapper, { [styles.slideDown]: isAnimating })}>
                <div className={styles.statsWrapper}>
                  <div className={styles.leftStats}>
                    {isRevealed.director ? (
                      <div>
                        <h1>Director</h1>
                        <p className={styles.director}>{director}</p>
                      </div>
                    ) : (
                      <div className={styles.hintDirector}>
                        <h1>Director</h1>
                        <div className={styles.revealBox} onClick={() => handleReveal('director')}>
                          <p>{reveal}</p>
                        </div>
                      </div>
                    )}
                    {isRevealed.totalWatched ? (
                      <div>
                        <h1>Watches</h1>
                        <p className={styles.totalWatched}>{formatNumber(totalWatched)}</p>
                      </div>
                    ) : (
                      <div>
                        <h1>Watches</h1>
                        <div className={styles.revealBox} onClick={() => handleReveal('totalWatched')}>
                          <p>{reveal}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {isRevealed.cast ? (
                    <div className={styles.cast}>
                    <h1>Cast</h1>
                    <p>{actor1}</p>
                    <p>{actor2}</p>
                    <p>{actor3}</p>
                  </div>
                  ) : (
                    <div className={styles.cast}>
                      <h1>Cast</h1>
                      <div className={styles.revealBox} onClick={() => handleReveal('cast')}>
                        <p>{reveal}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          <div className={classNames({ [styles.fadeOut]: isAnimating })}>
            <div className={hints ? styles.buttonsContainer : styles.buttonsContainerNH}>
              <button onClick={() => handleGuess('higher')}>Higher</button>
              <button onClick={() => handleGuess('lower')}>Lower</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
