const BASE_URL = "";

export const getAllMovies = async () => {
  const response = await fetch(`${BASE_URL}/movies/all`);
  const data = await response.json();
  return data;
};

export const getMovie = async (id) => {
  const response = await fetch(`${BASE_URL}/movies/${id}`);
  const data = await response.json();
  return data;
};

export const getUpcomingMovies = async () => {
  const response = await fetch(`${BASE_URL}/movies/upcoming`);
  const data = await response.json();
  return data;
};

export const getAllTvShows = async () => {
  const response = await fetch(`${BASE_URL}/tv-shows/all`);
  const data = await response.json();
  return data;
};

export const getTvShow = async (id) => {
  const response = await fetch(`${BASE_URL}/tv-shows/${id}`);
  const data = await response.json();
  return data;
};

export const getUpcomingTvShows = async () => {
  const response = await fetch(`${BASE_URL}/tv-shows/upcoming`);
  const data = await response.json();
  return data;
};

// export const getAllGenres = async () => {
//   const response = await fetch(`${BASE_URL}/all-genres`);
//   const data = await response.json();
//   return data.results;
// };

export const getAllMovieGenres = async () => {
  const response = await fetch(`${BASE_URL}/movies/all-genres`);
  const data = await response.json();
  return data;
};

export const getAllTvShowGenres = async () => {
  const response = await fetch(`${BASE_URL}/tv-shows/all-genres`);
  const data = await response.json();
  return data;
};


export const postAddMovie = async (formData) => {
  // const response = await fetch(`${BASE_URL}/add-movie`);
  const addMovieResponseData = await fetch(`${BASE_URL}/movies/add`, {
    headers: {
      'Accept': 'application/json',
    },
    // headers: {
    //   "Content-Type": "multipart/form-data", 
    // },
    method: 'POST',
    body: formData,
  });
  return addMovieResponseData;
  // When sending files using the Fetch API in React, you should omit the Content-Type header to allow the browser to 
  // automatically set the appropriate Content-Type for the request. This is necessary because specifying a Content-Type 
  // header can interfere with the browser's ability to correctly format the multipart form data for file uploads.
};


export const postAddTvShow = async (formData) => {
  const addTvShowResponseData = await fetch(`${BASE_URL}/tv-shows/add`, {
    headers: {
      'Accept': 'application/json',
    },
    // headers: {
    //   "Content-Type": "multipart/form-data", 
    // },
    method: 'POST',
    body: formData,
  });
  return addTvShowResponseData;
  // When sending files using the Fetch API in React, you should omit the Content-Type header to allow the browser to 
  // automatically set the appropriate Content-Type for the request. This is necessary because specifying a Content-Type 
  // header can interfere with the browser's ability to correctly format the multipart form data for file uploads.
};



export const putUpdateMovie = async (formData, movieID) => {
  const updateMovieResponseData = await fetch(`${BASE_URL}/movies/update/${movieID}`, {
    headers: {
      'Accept': 'application/json',
    },
    // headers: {
    //   "Content-Type": "multipart/form-data", 
    // },
    method: 'PUT',
    body: formData,
  });
  return updateMovieResponseData;
  // When sending files using the Fetch API in React, you should omit the Content-Type header to allow the browser to 
  // automatically set the appropriate Content-Type for the request. This is necessary because specifying a Content-Type 
  // header can interfere with the browser's ability to correctly format the multipart form data for file uploads.
};


export const putUpdateTvShow = async (formData, tvShowID) => {
  const updateTvShowResponseData = await fetch(`${BASE_URL}/tv-shows/update/${tvShowID}`, {
    headers: {
      'Accept': 'application/json',
    },
    // headers: {
    //   "Content-Type": "multipart/form-data", 
    // },
    method: 'PUT',
    body: formData,
  });
  return updateTvShowResponseData;
  // When sending files using the Fetch API in React, you should omit the Content-Type header to allow the browser to 
  // automatically set the appropriate Content-Type for the request. This is necessary because specifying a Content-Type 
  // header can interfere with the browser's ability to correctly format the multipart form data for file uploads.
};


export const deleteMovie = async (movieID) => {
  const deleteMovieResponseData = await fetch(`${BASE_URL}/movies/delete/${movieID}`, {
    method: 'DELETE',
  });
  return deleteMovieResponseData;
};


export const deleteTvShow = async (tvShowID) => {
  const deleteTvShowResponseData = await fetch(`${BASE_URL}/tv-shows/delete/${tvShowID}`, {
    method: 'DELETE',
  });
  return deleteTvShowResponseData;
};


export const getAllFavoriteMovies = async () => {
  const response = await fetch(`${BASE_URL}/movies/favorites/all`);
  const data = await response.json();
  return data;
};

export const addFavoriteMovie = async (movieID) => {
  const response = await fetch(`${BASE_URL}/movies/favorites/add/${movieID}`, {
    method: 'PATCH',
  });
  return response;
};

export const  removeFavoriteMovie = async (movieID) => {
  const response = await fetch(`${BASE_URL}/movies/favorites/remove/${movieID}`, {
    method: 'PATCH',
  });
  return response;
};


export const getAllFavoriteTvShows = async () => {
  const response = await fetch(`${BASE_URL}/tv-shows/favorites/all`);
  const data = await response.json();
  return data;
};

export const addFavoriteTvShow = async (tvShowID) => {
  const response = await fetch(`${BASE_URL}/tv-shows/favorites/add/${tvShowID}`, {
    method: 'PATCH',
  });
  return response;
};

export const  removeFavoriteTvShow = async (tvShowID) => {
  const response = await fetch(`${BASE_URL}/tv-shows/favorites/remove/${tvShowID}`, {
    method: 'PATCH',
  });
  return response;
};