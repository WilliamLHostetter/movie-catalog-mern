import TvShowCard from "../components/TvShowCard";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllTvShows, getAllTvShowGenres } from "../services/api";
import styles from '../css/TvShows.module.css';
import { sortReleaseDates, sortWatchedDates } from '../utilities/utils.js'
import { toast } from "react-toastify";


function TvShows() {
  const [selectedGenre, setGenre] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tvShows, setTvShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");
  const [genreFilteredTvShows, setGenreFilteredTvShows] = useState([]);
  const [filteredTvShows, setFilteredTvShows] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    document.title = 'TV Shows';
  }, []); // Empty dependency array ensures the effect runs only once on mount
  
  useEffect(() => {
    const loadTvShows = async () => {
      try {
        const allTvShows = await getAllTvShows();
        setTvShows(allTvShows);
        setFilteredTvShows(allTvShows);
        setGenreFilteredTvShows(allTvShows)
      } catch (error) {
        console.log("TvShow.jsx loadTvShows error:" + error.message);
        setError("Failed to load TV shows.");
        toast.error("Failed to load TV shows.");
      } finally {
        setLoading(false);
      }
    };

    loadTvShows();
  }, []);
  

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const allGenres = await getAllTvShowGenres();
        setGenres(allGenres);
      } catch (error) {
        console.log("TvShow.jsx loadGenres error:" + error.message);
        setError("Failed to load genres...");
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);


  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return
    if (loading) return

    setLoading(true)
    try {
        const searchResults = tvShows.filter((tvShow) =>
          tvShow.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredTvShows(searchResults)
        setSearchQuery(e.target.value)
        setError(null)
    } catch (error) {
      console.log("TvShow.jsx handleSearch error:" + error.message);
        setError("Failed to search TV Shows...")
    } finally {
        setLoading(false)
    }
  };

  const handleGenre = async (inputGenre) => {
    if (inputGenre === "" || inputGenre === "Genres") {
      setFilteredTvShows(tvShows)
      setGenreFilteredTvShows(tvShows)
      setGenre("Genres")
      return
    }
    setLoading(true)
    try {
        const genreResults = tvShows.filter((tvShow) =>
          tvShow.genre.toLowerCase().includes(inputGenre.toLowerCase()));
        setFilteredTvShows(genreResults)
        setGenreFilteredTvShows(genreResults)
        setGenre(inputGenre)
        setError(null)
    } catch (error) {
        console.log("TvShow.jsx handleGenre error:" + error.message);
        setError("Failed to select genre...")
    } finally {
        setLoading(false)
    }
  };
  
  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
    switch (sortOption) {
      case "title":
        const sortedTitleTvShows = filteredTvShows.toSorted((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
        setFilteredTvShows(sortedTitleTvShows)
        break;
      case "release_date":
        const sortedDateTvShows = sortReleaseDates(filteredTvShows);
        setFilteredTvShows(sortedDateTvShows)
        break;
      case "watched_date":
        const sortedWatchedDateTvShows = sortWatchedDates(filteredTvShows);
        setFilteredTvShows(sortedWatchedDateTvShows)
        break;
      default:
        setFilteredTvShows(genreFilteredTvShows)
        break;
    }
  };  

  return (
    <div className={styles.page}>
      <h2 className={styles['page-title']}>TV Shows</h2>
      <form onSubmit={handleSearch} className={styles['search-form']}>
        <input
          type="text"
          placeholder="Search for TV shows..."
          className={styles['search-input']}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className={styles['search-button']}>
          Search
        </button>
      </form>

        {error && <div className={styles['error-message']}>{error}</div>}
        <section className={styles['sorts-container']}>
          <select
            value={selectedGenre}
            onChange={(e) => handleGenre(e.target.value)}
          >
            <option value="">Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <select 
            value={selectedSort}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="title">Title</option>
            <option value="release_date">Release Date</option>
            <option value="watched_date">Watched Date</option>
          </select>
        </section>
        <section className={styles['create-container']}>
        <Link to="/add-tv-show" target="_blank" rel="noopener noreferrer">
          <button>Add TV Show</button>
        </Link>
        </section>

      {loading ? (
        <div className={styles['loading']}>Loading...</div>
      ) : (
        <div className={styles['tv-shows-grid']}>
          { (Array.isArray(filteredTvShows) && filteredTvShows.length > 0) ? filteredTvShows.map((tvShow) => (
            <TvShowCard tvShow={tvShow} key={tvShow._id} />
          )) : <p className={styles['center-text']}>No TV shows found</p> }
        </div>
      )}
    </div>
  );
}

export default TvShows;
