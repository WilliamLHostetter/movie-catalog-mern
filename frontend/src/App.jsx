import "./css/App.css";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import AddMovie from "./pages/AddMovie";
import UpdateMovie from "./pages/UpdateMovie";
import AddTvShow from "./pages/AddTvShow";
import UpdateTvShow from "./pages/UpdateTvShow";
import TvShows from "./pages/TvShows";
import Favorites from "./pages/Favorites";
import { Routes, Route } from "react-router-dom";
import { MovieProvider } from "./contexts/MovieContext";
import { TvShowProvider } from "./contexts/TvShowContext";

import NavBar from "./components/NavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <MovieProvider>
      <TvShowProvider>
        <ToastContainer />
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/add-movie" element={<AddMovie />} />
            <Route path="/update-movie/:id" element={<UpdateMovie />} />
            <Route path="/tv-shows" element={<TvShows />} />
            <Route path="/add-tv-show" element={<AddTvShow />} />
            <Route path="/update-tv-show/:id" element={<UpdateTvShow />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>
      </TvShowProvider>
    </MovieProvider>
  );
}

export default App;
