import { Link } from "react-router-dom";
import styles from '../css/Navbar.module.css';

function NavBar() {
    return <nav className={styles.navbar}>
        <div className={styles['navbar-brand']}>
            <Link to="/">Home</Link>
        </div>
        <div className={styles['navbar-links']}>
            <Link to="/movies" className={styles['nav-link']}>Movies</Link>
            <Link to="/tv-shows" className={styles['nav-link']}>TV Shows</Link>
            <Link to="/favorites" className={styles['nav-link']}>Favorites</Link>
        </div>
    </nav>
}

export default NavBar