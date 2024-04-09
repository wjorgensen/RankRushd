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
  onOpenChange?: (isOpen: boolean) => void;
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
  onOpenChange
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
    setAnimatedRating(0.00);
    setIsRevealed((prevState) => ({
      ...prevState,
      ['director']: true,
      ['cast']: true,
      ['totalWatched']: true,
    }));
    setIsAnimating(true);
    setShowRating(true);
    animateRating(0, rating, 1000);
  
    const animationDuration = 2500;
    let triggerSlide: boolean = true;
  
    setTimeout(() => { 
      if (onGuess) {
        triggerSlide = onGuess(guess);
      }
      if (onOpenChange) {
        if(triggerSlide){
          onOpenChange(true);
        }
      }
    }, animationDuration);
  
    setTimeout(() => {
      if(triggerSlide){
        setIsAnimating(false);
        setShowRating(false);
        setIsRevealed((prevState) => ({
          ...prevState,
          ['director']: false,
          ['cast']: false,
          ['totalWatched']: false,
        }));
      }
    }, animationDuration + 1000);
  };
  

  const cardClasses = classNames(styles.movieCard, {
    [styles.withHints]: !isOpen && hints,
  });

  const breakdownCast = (cast: string): [string, string, string] => {
    const actors = cast.slice(1, -1) 
                      .split(",") 
                      .map(actor => actor.trim().replace(/^"|"$/g, '')) 
                      .filter(Boolean); 

    while (actors.length < 3) {
        actors.push('');
    }

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

  const [showRating, setShowRating] = useState(false);
  const [animatedRating, setAnimatedRating] = useState(0);

  const animateRating = (start: number, end: number, duration: number) => {
    setTimeout(() => {
      let startTime: number;
  
      const step = (currentTime: number) => {
        startTime = startTime || currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const currentRating = start + (end - start) * progress;
        setAnimatedRating(currentRating);
    
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setAnimatedRating(end);
        }
      };
    
      requestAnimationFrame(step);
    }, 500)
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
          {showRating && (
            <div className={styles.rating}>
              <div>
                <p>{animatedRating.toFixed(2)}</p>
              </div>
            </div>
          )}
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
                    <div className={styles.castNotRevealed}>
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
