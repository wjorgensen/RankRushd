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
  Actor1: string;
  Actor2: string;
  Actor3: string;
  Average_rating: string;
  Watches: string;
  Film_URL: string;
}


export default function Home() {
  const [movieData, setMovieData] = useState<MovieData[]>([]);
  const router = useRouter();
  const { hints, difficulty } = router.query;
  const [showOverlay, setShowOverlay] = useState(false);
  const [showOverlay2, setShowOverlay2] = useState(true);
  const [overlayTrigger, setOverlayTrigger] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(0);
  const [numHints, setHints] = useState(0);
  const [openMovie, setOpenMovie] = useState<MovieData | null>(null);
  const [guessMovie, setGuessMovie] = useState<MovieData | null>(null);
  const [thirdMovie, setThirdMovie] = useState<MovieData | null>(null);
  const [isSliding, setIsSliding] = useState(false);
  const [endgame, setEndGame] = useState(false);
  const [seenMovies, setSeenMovies] = useState<SeenMovies>({});
  type SeenMovies = Record<string, boolean>;



  useEffect(() => {
    if (movieData.length > 0) {
      const randomMovies = getRandomMovies(movieData, 3);
      setOpenMovie(randomMovies[0]);
      setGuessMovie(randomMovies[1]);
      setThirdMovie(randomMovies[2]);
    }
  }, [movieData]);

  const getRandomMovies = (movies: MovieData[], count: number): MovieData[] => {
    const validMovies = movies.filter(movie => movie.Film_title !== "Film_title" && !seenMovies[movie.Film_title]);

    // Shuffle and slice to get the random movies
    const shuffled = [...validMovies].sort(() => 0.5 - Math.random());
    const selectedMovies = shuffled.slice(0, count);

    // Prepare the updated seenMovies state
    const newSeenMovies: SeenMovies = {...seenMovies};
    selectedMovies.forEach(movie => {
      newSeenMovies[movie.Film_title] = true;
    });
    setSeenMovies(newSeenMovies);

    return selectedMovies;
  };

  const handleHintUsed = ():boolean => {
    if(numHints < 0){
      return true;
    } else if(numHints === 0) {
      return false;
    } else {
      setHints(numHints - 1);
      return true;
    }
  };

  const handleGuess = (guess: 'higher' | 'lower'):boolean => {
      if(guess === 'higher'){
          if((openMovie?.Average_rating ?? 0) <= (guessMovie?.Average_rating ?? 0)){
            handleCorrectGuess();
            return true;
          }
          else{
            handleWrongGuess();
            if(lives === 1){
              setEndGame(true);
              return false;
            }
            return true;
          }
      }else {
        if((openMovie?.Average_rating ?? 0) >= (guessMovie?.Average_rating ?? 0)){
          handleCorrectGuess();
          return true;
        }
        else{
          handleWrongGuess();
          if(lives === 1){
            setEndGame(true);
            return false;
          }
          return true;
        }
      }
  };

  const handleWrongGuess = () => {
    setTimeout(() => {
      setLives((currentLives) => {
        if(currentLives <= 1){
          endGame();
          return 0;
        } else {
          return currentLives - 1;
        }
      });
    }, 600);
  }

  const handleCorrectGuess = () => {
    setTimeout(() => {
      setScore(score+1)
    }, 800);
  }

  const endGame = () => {
    if (typeof window !== "undefined") { 
      const currentHighestScore = localStorage.getItem('highscore');
      const highestEverScore = currentHighestScore ? parseInt(currentHighestScore, 10) : 0;

      if (score > highestEverScore) {
        localStorage.setItem('highscore', score.toString());
      }

      localStorage.setItem('score', score.toString());

      setSeenMovies({});
      setOverlayTrigger('endGame');
      setShowOverlay(true);
    }
  }

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
        if( overlayTrigger === 'endGame') {
          router.push('/end');
        }
      }, 500);
  
      return () => clearTimeout(timer);
  };

  const handleOverlayTransitionEnd2 = () => {
    setShowOverlay2(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen || endgame) return;
    
    if(!endgame){
      setIsSliding(true);
    }

    setTimeout(() => {
      setIsSliding(false);
      updateMovies();
    }, 1000); 
  };

  const updateMovies = () => {
    setOpenMovie(guessMovie);

    let remainingMovies = movieData.filter(movie => movie !== openMovie && movie !== guessMovie && movie !== thirdMovie);

    remainingMovies = remainingMovies.sort(() => 0.5 - Math.random());

    const newGuessMovie = remainingMovies[0];
    const newThirdMovie = remainingMovies[1] || remainingMovies[0]; 

    setGuessMovie(thirdMovie);
    setThirdMovie(newThirdMovie);
  };
  
  

  return (
    <>
        {showOverlay && <Overlay direction="down" onTransitionEnd={handleOverlayTransitionEnd} />}
        {showOverlay2 && <Overlay direction="up" onTransitionEnd={handleOverlayTransitionEnd2} />}
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
            {hints === "ON" ? (numHints === -1 ? <p>Hints: {"∞"}</p> : <p>Hints: {numHints}</p>) : ""}
          </div>
        </div> 
      <div className={styles.gameContainer}>
        <div className={`${isSliding ? styles.slideOutLeft : ''}`}>
          {openMovie && (
            <MovieCard
              imageUrl={openMovie.Film_URL}
              movieName={openMovie.Film_title}
              rating={parseFloat(openMovie.Average_rating)}
              director={openMovie.Director}
              actor1 = {openMovie.Actor1}
              actor2 = {openMovie.Actor2}
              actor3 = {openMovie.Actor3}
              totalWatched={parseInt(openMovie.Watches, 10)}
              isOpen={true}
              hints={false}
              onHintUsed={handleHintUsed}
              onGuess={handleGuess}
              onOpenChange={handleOpenChange}
            />
          )}
        </div>
        <div className={isSliding ? styles.slideOutLeft : ''}>
          {guessMovie && (
            <MovieCard
              imageUrl={guessMovie.Film_URL}
              movieName={guessMovie.Film_title}
              rating={parseFloat(guessMovie.Average_rating)}
              director={guessMovie.Director}
              actor1 = {guessMovie.Actor1}
              actor2 = {guessMovie.Actor2}
              actor3 = {guessMovie.Actor3}
              totalWatched={parseInt(guessMovie.Watches, 10)}
              isOpen={false}
              hints={hints === 'ON'}
              onHintUsed={handleHintUsed}
              onGuess={handleGuess}
              onOpenChange={handleOpenChange}
            />
          )}
        </div>
        <div className={(isSliding ? styles.slideOutLeft : '' )}>
          <div className={styles.thirdMovie}>
            {thirdMovie && (
              <MovieCard
              imageUrl={thirdMovie.Film_URL}
              movieName={thirdMovie.Film_title}
              rating={parseFloat(thirdMovie.Average_rating)}
              director={thirdMovie.Director}
              actor1 = {thirdMovie.Actor1}
              actor2 = {thirdMovie.Actor2}
              actor3 = {thirdMovie.Actor3}
              totalWatched={parseInt(thirdMovie.Watches, 10)}
              isOpen={false}
              hints={hints === 'ON'}
              onHintUsed={handleHintUsed}
              onGuess={handleGuess}
              onOpenChange={handleOpenChange}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}