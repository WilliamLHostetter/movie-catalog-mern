import { useMovieContext } from "../contexts/MovieContext";
import { useTvShowContext } from "../contexts/TvShowContext";
import MovieCard from "../components/MovieCard";
import TvShowCard from "../components/TvShowCard";
import { useEffect } from "react";
import styles from '../css/Favorites.module.css';


function Favorites() {

  useEffect(() => {
    document.title = 'Favorites';
  }, []); 

  const { movieFavorites } = useMovieContext();
  const { tvShowFavorites } = useTvShowContext();

  return (
    <div className={styles.page}>
      <h2 className={styles['page-title']}>Favorites</h2>
      <h3 className={styles['category']}>Movies</h3>
      { movieFavorites.length === 0 && 
      <div className={styles['favorites-empty']}>
        <h2>No favorite movies yet</h2>
        <p>Start adding movies to your favorites and they will appear here!</p>
      </div>
      }
      <div className={styles['card-grid']}>
      {movieFavorites.length > 0 && movieFavorites.map((movie) => (
        <MovieCard movie={movie} key={movie._id} />
      )) }
      </div>
      <h3 className={styles['category']}>TV Shows</h3>
      {tvShowFavorites.length === 0 && 
      <div className={styles['favorites-empty']}>
        <h2>No favorite TV shows yet</h2>
        <p>Start adding TV shows to your favorites and they will appear here!</p>
      </div>
      }
      <div className={styles['card-grid']}>
      {tvShowFavorites.length > 0 && tvShowFavorites.map((tvShow) => (
        <TvShowCard tvShow={tvShow} key={tvShow._id} />
      )) }
      </div>  
    </div>
  );
}

export default Favorites;
