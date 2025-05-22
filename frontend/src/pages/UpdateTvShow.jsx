import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getTvShow, putUpdateTvShow } from "../services/api";
import { useParams } from 'react-router-dom'
import styles from '../css/AddTvShow.module.css';
import { validReleaseDateString, validWatchedDateString } from '../utilities/utils.js'


function UpdateTvShow() {
  const { id } = useParams();
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // 'idle' | 'uploading' | 'success' | 'error'
  const tvShowDataDefault = {
    title: "",
    year: 0,
    description: "",
    image: null,
    cast: "",
    genre: "",
    watched_date: "",
  }
  const [tvShowData, setTvShowData] = useState(tvShowDataDefault);
  
  useEffect(() => {
    document.title = 'Update TV Show';
  }, []);
  
  useEffect(() => {
    const loadTvShow = async () => {
      try {
        const tvShow = await getTvShow(id);
        setTvShowData(tvShow);
      } catch (error) {
        console.log("UpdateTvShow.jsx loadTvShow error:" + error.message);
        toast.success(`Failed to load tv show id = ${id}`);
      }
    };
    loadTvShow();
  }, [id]);
  

  const handleChange = (event) => {
    const { value, name } = event.target;
    setTvShowData({ ...tvShowData, [name]: value });
  };
  
  const handleBlur = (event) => {
    const { value, name } = event.target;
    setTvShowData({ ...tvShowData, [name]: value.trim() });
  };  

  const handleFileChange = (event) => {
    if(event.target.files) {
      setFile(event.target.files[0]);
      setTvShowData({ ...tvShowData, image: file });
    }
  };

  const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        if (
          !tvShowData.title ||
          !tvShowData.description ||
          !tvShowData.genre
        ) {
          toast.error("Please fill all required fields");
          return;
        }
        if(!validReleaseDateString(tvShowData.release_date)){
          toast.error("Invalid TV show release date string");
          return;
        }
        if(!validWatchedDateString(tvShowData.watched_date)){
          toast.error("Invalid TV show watched date string");
          return;
        }
        const formData = new FormData(event.target);
        formData.append('file', file);
        // Display the key/value pairs
        // for (var pair of formData.entries()) { 
        //   console.log(pair[0]+ ': ' + pair[1]);
        // }
        try {
          const updateTvShowResponseData = await putUpdateTvShow(formData, id);
          if(updateTvShowResponseData.status === 200) {
            toast.success("TV Show Updated");
            setStatus('success')
          } else {
            console.log("Error in update TV Show put data");
            toast.error("Error in update TV Show put data");
            setStatus('error')
          }
        } catch (error) {
          console.log("Error in update TV Show put data: " + error.message);
          toast.error("Error in update TV Show put data: " + error.message);
          setStatus('error')
        }
        setFile(null);
    } catch (error) {
      toast.error(`Failed to create movie: ${error}`);
    }
  }
  
  
  return (
    <div className={styles.page}>
      <h2 className={styles['page-title']}>Update TV Show</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles['form-field']}>
          <label htmlFor="title">
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={tvShowData.title}
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
              value={tvShowData.description}
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
            id="cast"
            name="cast"
            value={tvShowData.cast}
            onChange={handleChange}
            onBlur={handleBlur}
            className={styles['cast-input']}
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
            value={tvShowData.watched_date}
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
            value={tvShowData.release_date}
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
            value={tvShowData.genre}
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
        <p className={styles['status-msg-success']}>TV show updated successfully!</p>
      )}

      {status === 'error' && (
        <p className={styles['status-msg-error']}>TV show update failed. Please try again.</p>
      )}

      </form>
    </div>
    );
  };

export default UpdateTvShow;

