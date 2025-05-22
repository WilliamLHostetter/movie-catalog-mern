import { Link } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext"
import { useRef } from "react";
import styles from '../css/TvShowCard.module.css';


function TvShowCard({tvShow}) {
    const {isFavorite, addToFavorites, removeFromFavorites} = useMovieContext()
    const favorite = isFavorite(tvShow._id)

    function onFavoriteClick(e) {
        e.preventDefault()
        if (favorite) removeFromFavorites(tvShow._id)
        else addToFavorites(tvShow)
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
    <div className={styles['tv-show-card']}>
        <div className={styles['tv-show-poster']}>
            <img src={`http://localhost:5000/tv-shows/images/${tvShow.image}`} alt={tvShow.title}  />
            <div className={styles['tv-show-overlay']} onClick={toggleDialog}></div>
            <button className={`${styles['favorite-btn']}  ${favorite ? styles.active : ""}`} onClick={onFavoriteClick}>
              ♥
            </button>
            <dialog ref={dialogRef} onClick={(e) => {if (e.currentTarget === e.target) {toggleDialog();} }}>
              <div className={styles['inner-dialog-box']}>
                <h2>{tvShow.title}</h2>
                <div>
                  <h3>Overview</h3>
                  <p>{tvShow.description}</p>
                </div>
                <div>
                  <h3>Release Date</h3>
                  <p>{tvShow.release_date}</p>
                </div>
                <div>
                  <h3>Genre</h3>
                  <p>{tvShow.genre}</p>
                </div>
                <div>
                  <h3>Cast</h3>
                  <p>{tvShow.cast}</p>
                </div>
                <div className={styles['edit']}>
                <Link to={"/edit-tv-show/" + tvShow._id}>
                  <button>Edit TV Show</button>
                </Link>
                </div>
              </div>
            </dialog>
        </div>
        <div className= {styles['tv-show-info']}>
            <h3>{tvShow.title}</h3>
            <p>Release Date: {tvShow.release_date}</p>
        </div>
    </div>
    );
}

export default TvShowCard