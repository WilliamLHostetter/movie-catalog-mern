import UpcomingMovieCard from "../components/UpcomingMovieCard";
import UpcomingTvShowCard from "../components/UpcomingTvShowCard";
import { useState, useEffect } from "react";
import { getUpcomingMovies } from "../services/api";
import { getUpcomingTvShows } from "../services/api";
import styles from '../css/Home.module.css';


function Home() {
  const [latestMovies, setLatestMovies] = useState([]);
  const [latestTvShows, setLatestTvShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Home';
  }, []); // Empty dependency array ensures the effect runs only once on mount

  
  useEffect(() => {
    const loadMovies = async () => {
      try {
        // const loadedMovies = await getLatestMovies();
        const loadedMovies = await getUpcomingMovies();
        setLatestMovies(loadedMovies);
      } catch (error) {
        console.log("Home.jsx loadMovies error:" + error.message);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  useEffect(() => {
    const loadTvShows = async () => {
      try {
        // const loadedTvShows = await getLatestTvShows();
        const loadedTvShows = await getUpcomingTvShows();
        setLatestTvShows(loadedTvShows);
      } catch (error) {
        console.log("Home.jsx loadTvShows error:" + error.message);
      } finally {
        setLoading(false);
      }
    };

    loadTvShows();
  }, []);
  

  return (
    <div className={styles.page}>
      <h2 className={styles['page-title']}>Home</h2>
      <h3 className={styles['category']}>Upcoming Movies</h3>
      {loading ? (
        <div className={styles['loading']}>Loading...</div>
      ) : (
        <div className={styles['card-grid']}>
          { (Array.isArray(latestMovies) && latestMovies.length > 0) ? latestMovies.map((movie) => (
              <UpcomingMovieCard movie={movie} key={movie._id} />
            )) : <p className={styles['center-text']}>No Movies found</p> }
        </div>
      )}
      
      <h3 className={styles['category']}>Upcoming TV Shows</h3>
      {loading ? (
        <div className={styles['loading']}>Loading...</div>
      ) : (
        <div className={styles['card-grid']}>
          { (Array.isArray(latestTvShows) && latestTvShows.length > 0) ? latestTvShows.map((tvShow) => (
              <UpcomingTvShowCard tvShow={tvShow} key={tvShow._id} />
            )) : <p className={styles['center-text']}>No TV Shows found</p> }
        </div>
      )}
    </div>
  );
}

export default Home;
