import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { postAddTvShow } from "../services/api";
import styles from '../css/AddTvShow.module.css';
import { validReleaseDateString, validWatchedDateString } from '../utilities/utils.js'



function AddTvShow() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // 'idle' | 'uploading' | 'success' | 'error'
  const tvShowDataDefault = {
    title: "",
    description: "",
    image: null,
    cast: "",
    genre: "",
    watched_date: "",
    release_date: "",
  }
  const [tvShowData, setTvShowData] = useState(tvShowDataDefault);
  
  useEffect(() => {
    document.title = 'Add TV Show';
  }, []);
  
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
          !tvShowData.genre ||
          !file
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
          const addTvShowResponseData = await postAddTvShow(formData);
          // console.log("addTvShowResponseData.status = " + addTvShowResponseData.status)
          if(addTvShowResponseData.status === 200) {
            toast.success("TV Show Added");
            setStatus('success')
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
        setTvShowData(tvShowDataDefault);
        setFile(null);
        toast.success("TV Show Added");
        setStatus('success')

    } catch (error) {
      toast.error(`Failed to create TV show: ${error}`);
    }
  }
  
  
  return (
    <div className={styles.page}>
      <h2 className={styles['page-title']}>Add TV Show</h2>
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
            id="cast"
            type="text"
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
            id="watched_date"
            type="text"
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
        <p className={styles['status-msg-success']}>TV show added successfully!</p>
      )}

      {status === 'error' && (
        <p className={styles['status-msg-error']}>Failed to add TV show. Please try again.</p>
      )}

      </form>
    </div>
    );
  };

export default AddTvShow;

