import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { postAddMovie } from "../services/api";
import styles from '../css/AddMovie.module.css';
import { validReleaseDateString, validWatchedDateString } from '../utilities/utils.js'



function AddMovie() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // 'idle' | 'uploading' | 'success' | 'error'
  const movieDataDefault = {
    title: "",
    description: "",
    image: null,
    cast: "",
    genre: "",
    length: "",
    watched_date: "",
    release_date: "",
  }
  const [movieData, setMovieData] = useState(movieDataDefault);
  
  useEffect(() => {
    document.title = 'Add Movie';
  }, []);

  const handleChange = (event) => {
    const { value, name } = event.target;
    setMovieData({ ...movieData, [name]: value });
  };

  const handleBlur = (event) => {
    const { value, name } = event.target;
    setMovieData({ ...movieData, [name]: value.trim() });
  };  

  const handleFileChange = (event) => {
    if(event.target.files) {
      setFile(event.target.files[0]);
      setMovieData({ ...movieData, image: file });
    }
  };

  const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        if (
          !movieData.title ||
          !movieData.description ||
          !movieData.genre ||
          !file
        ) {
          toast.error("Please fill all required fields");
          return;
        }
        if(!validReleaseDateString(movieData.release_date)){
          toast.error("Invalid movie release date string");
          return;
        }
        if(!validWatchedDateString(movieData.watched_date)){
          toast.error("Invalid movie watched date string");
          return;
        }
        
        const formData = new FormData(event.target);
        formData.append('file', file);
        // Display the key/value pairs
        // for (var pair of formData.entries()) { 
        //   console.log(pair[0]+ ': ' + pair[1]);
        // }
        try {
          const addMovieResponseData = await postAddMovie(formData);
          if(addMovieResponseData.status === 200) {
            toast.success("Movie Added");
            setStatus('success')
            setMovieData(movieDataDefault);
          } else {
            console.log("Error in post data");
            toast.error("Error in post data");
            setStatus('error')
          }
        } catch (error) {
          console.log("Error in post data" + error.message);
          toast.error("Error in post data" + error.message);
          setStatus('error')
        }
        setMovieData(movieDataDefault);
        setFile(null);
    } catch (error) {
      toast.error(`Failed to create movie: ${error}`);
    }
  }
  
  
  return (
    <div className={styles.page}>
      <h2 className={styles['page-title']}>Add Movie</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles['form-field']}>
          <label htmlFor="title">
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={movieData.title}
            onChange={handleChange}
            onBlur={handleBlur} 
            className={styles['title-input']}
            />
        </div>
        <div className={styles['form-field']}>
          <label htmlFor="description">
            Description:
          </label>
          <textarea
              id="description"
              name="description"
              value={movieData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className={styles['description-input']}
            ></textarea>
        </div>
        <div className={styles['form-field']}>
          <label htmlFor="cast">
            Cast <span className={styles['form-field-label-note']}>(comma-separated)</span>:
          </label>
          <input
            type="text"
            id="name"
            name="cast"
            value={movieData.cast}
            onChange={handleChange}
            onBlur={handleBlur} 
            className={styles['cast-input']}
          />          
        </div>
        <div className={styles['form-field']}>
          <label htmlFor="length">
            Length <span className={styles['form-field-label-note']}>(?h ?m)</span>:
          </label>
          <input
            type="text"
            id="length"
            name="length"
            value={movieData.length}
            onChange={handleChange}
            onBlur={handleBlur}
            className={styles['length-input']}
          />
        </div>
        <div className={styles['form-field']}>
          <label htmlFor="watched_date">
            Watched Date <span className={styles['form-field-label-note']}>(Blank or ISO 8601 Format [YYYY-MM-DD, YYYY-MM, or YYYY])</span>:
          </label>
          <input
            type="text"
            id="watched_date"
            name="watched_date"
            value={movieData.watched_date}
            onChange={handleChange}
            onBlur={handleBlur}
            className={styles['length-input']}
          />
        </div>
        <div className={styles['form-field']}>
          <label htmlFor="release_date">
            Release Date <span className={styles['form-field-label-note']}>(Blank, TBA, or ISO 8601 Format [YYYY-MM-DD, YYYY-MM, or YYYY])</span>:
          </label>
          <input
            type="text"
            id="release_date"
            name="release_date"
            value={movieData.release_date}
            onChange={handleChange}
            onBlur={handleBlur}
            className={styles['length-input']}
          />
        </div>
        <div className={styles['form-field']}>
          <label htmlFor="genre">
            Genre <span className={styles['form-field-label-note']}>(comma-separated)</span>:
          </label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={movieData.genre}
            onChange={handleChange}
            onBlur={handleBlur}
            className={styles['length-input']}
            />
        </div>
        <div className={styles['form-field']}>
          <label htmlFor="image_file">Image File:</label>
          <input className={styles['file-input']} type="file" id="image_file" onChange={handleFileChange} />
          {file && (
          <div className={styles['file-details']}>
            <p>File name: {file.name}</p>
            <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
            <p>Type: {file.type}</p>
          </div>
          )}
        </div>
        <div className={styles['form-field']}>
          <input className={styles['submit-button']} type="submit" value="Submit" />
        </div>
        
      {status === 'success' && (
        <p className={styles['status-msg-success']}>Movie added successfully!</p>
      )}

      {status === 'error' && (
        <p className={styles['status-msg-error']}>Failed to add movie. Please try again.</p>
      )}

      </form>
    </div>
    );
  };

export default AddMovie;

