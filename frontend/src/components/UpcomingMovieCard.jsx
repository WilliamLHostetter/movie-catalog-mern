import { Link } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext"
import { useRef } from "react";
import styles from '../css/MovieCard.module.css';


function MovieCard({movie}) {
    const {isFavorite, addToFavorites, removeFromFavorites} = useMovieContext()
    const favorite = isFavorite(movie._id)
    function onFavoriteClick(e) {
        e.preventDefault()
        if (favorite) removeFromFavorites(movie._id)
        else addToFavorites(movie)
    }
    const dialogRef = useRef(null);

    function toggleDialog() {
        if (!dialogRef.current) {
            return;
        }
        dialogRef.current.hasAttribute("open")
        ? dialogRef.current.close()
        : dialogRef.current.showModal();
    }

    return (
    <div className={styles['movie-card']}>
      <div className={styles['movie-poster']}>
        <img src={`http://localhost:5000/movies/images/${movie.image}`} alt={movie.title} />
        <div className={styles['movie-overlay']} onClick={toggleDialog}></div>
        <dialog ref={dialogRef} onClick={(e) => {if (e.currentTarget === e.target) {toggleDialog();} }}>
          <div className={styles['inner-dialog-box']}>
            <h2>{movie.title}</h2>
            <div>
              <h3>Overview</h3>
              <p>{movie.description}</p>
            </div>
            <div>
              <h3>Release Date</h3>
              <p>{movie.release_date}</p>
            </div>
            {movie.hasOwnProperty('length') && (
            <div>
              <h3>Length</h3>
              <p>{movie.length}</p>
            </div>
            )}
            <div>
              <h3>Genre</h3>
              <p>{movie.genre}</p>
            </div>
            <div>
              <h3>Cast</h3>
              <p>{movie.cast}</p>
            </div>
            <div className={styles['edit']}>
            <Link to={"/edit-movie/" + movie._id}>
              <button>Edit Movie</button>
            </Link>
            </div>
          </div>
        </dialog>
        <button className={`${styles['favorite-btn']} ${favorite ? styles.active : ""}`} onClick={onFavoriteClick}>
          ♥
        </button>        
      </div>
        <div className={styles['movie-info']}>
            <h3>{movie.title}</h3>
            <p>Release Date: {movie.release_date}</p>
        </div>
    </div>
    );
}

export default MovieCard