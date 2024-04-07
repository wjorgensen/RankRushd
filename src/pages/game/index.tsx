import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Papa from 'papaparse';
import styles from './Game.module.scss';
import Overlay from '@/components/overlay/Overlay'
import Image from 'next/image';
import MovieCard from '@/components/movie-card/MovieCard';

interface MovieData {
  Film_title: string;
  Director: string;
  Cast: string;
  Average_rating: string;
  Watches: string;
  Film_URL: string;
}

export default function Home() {
  const [movieData, setMovieData] = useState<MovieData[]>([]);
  const router = useRouter();
  const { hints, difficulty } = router.query;
  const [showOverlay, setShowOverlay] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [overlayTrigger, setOverlayTrigger] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(0);
  const [numHints, setHints] = useState(0);
  const [openMovie, setOpenMovie] = useState<MovieData | null>(null);
  const [guessMovie, setGuessMovie] = useState<MovieData | null>(null);


  useEffect(() => {
    if (movieData.length > 0) {
      const randomMovies = getRandomMovies(movieData, 2);
      setOpenMovie(randomMovies[0]);
      setGuessMovie(randomMovies[1]);
    }
  }, [movieData]);

  const getRandomMovies = (movies: MovieData[], count: number): MovieData[] => {
    const shuffled = [...movies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleHintUsed = () => {
    if (numHints > 0) {
      setHints(numHints - 1);
    }
  };

  const handleGuess = (guess: 'higher' | 'lower') => {
    // Implement the game logic for handling the user's guess
    // Update the score, lives, etc. based on the guess
  };

  useEffect(() => {
    const parsedLives = parseInt(router.query.lives as string, 10);
    const parsedHints = parseInt(router.query.numHints as string, 10);
    setLives(parsedLives);
    setHints(parsedHints);
  }, [router.query.lives, router.query.numHints]);

  useEffect(() => {
    const fetchData = async () => {
      let csvFile = '';

      switch (difficulty) {
        case 'Casual':
          csvFile = '/250.csv';
          break;
        case 'Average':
          csvFile = '/500.csv';
          break;
        case 'Cinephile':
          csvFile = '/1000.csv';
          break;
        default:
          csvFile = '/250.csv';
      }

      const response = await fetch(csvFile);
      const csvData = await response.text();
      const parsedData = Papa.parse<MovieData>(csvData, { header: true }).data;
      setMovieData(parsedData);
    };

    fetchData();
  }, [difficulty]);

  const handleLogoClick = () => {
        setOverlayTrigger('logo');
        setShowOverlay(true);
   };

   const handleOverlayTransitionEnd = () => {
    const timer = setTimeout(() => {
        if (overlayTrigger === 'logo') {
            router.push('/');
        }
      }, 500);
  
      return () => clearTimeout(timer);
};

  return (
    <>
        {showOverlay && <Overlay direction="down" onTransitionEnd={handleOverlayTransitionEnd} />}
        <div className={styles.logo}>
            <button onClick={handleLogoClick}>
                <p>Rank Rushd</p>
            </button>
        </div>
        <div className={styles.stats}>
            <div className={styles.lives}>
            <p>Lives: </p>
            {Array.from({ length: lives }, (_, index) => (
                <Image key={index} src="/heart.svg" alt="Life" width={30} height={30} />
            ))}
            </div>
            <div className={styles.numStats}>
                <p>Score: {score}</p>
                {hints === "ON" ? <p>Hints: {numHints}</p> : ""}
            </div>
        </div> 
        <div className={styles.gameContainer}>
        {openMovie && (
          <MovieCard
            imageUrl={"https://a.ltrbxd.com/resized/sm/upload/3p/mh/wq/v9/6Ryitt95xrO8KXuqRGm1fUuNwqF-0-1000-0-1500-crop.jpg?v=2a90bd6512"}
            movieName={openMovie.Film_title}
            rating={parseFloat(openMovie.Average_rating)}
            director={openMovie.Director}
            cast={openMovie.Cast}
            totalWatched={parseInt(openMovie.Watches, 10)}
            hints={false}
            onHintUsed={handleHintUsed}
            onGuess={handleGuess}
          />
        )}
        {guessMovie && (
          <MovieCard
            imageUrl={"https://a.ltrbxd.com/resized/sm/upload/3p/mh/wq/v9/6Ryitt95xrO8KXuqRGm1fUuNwqF-0-1000-0-1500-crop.jpg?v=2a90bd6512"}
            movieName={guessMovie.Film_title}
            rating={parseFloat(guessMovie.Average_rating)}
            director={guessMovie.Director}
            cast={guessMovie.Cast}
            totalWatched={parseInt(guessMovie.Watches, 10)}
            hints={hints === 'ON'}
            onHintUsed={handleHintUsed}
            onGuess={handleGuess}
          />
        )}
      </div>
    </>
  );
}