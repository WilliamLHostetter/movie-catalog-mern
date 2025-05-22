
export const sortReleaseDates = (inputItems) => {
  if (!Array.isArray(inputItems) || inputItems.length < 2) {
    return inputItems
  }
  try {
    const sortedItemsByReleaseDate = inputItems.toSorted((a, b) => {

      if((a.release_date === b.release_date) || 
        (!a.release_date && b.release_date.includes("TBA")) || 
        (!b.release_date && a.release_date.includes("TBA"))) {
          return 0
        }
      if((!isNaN(a.release_date) && (new Date(a.release_date).toString() !== "Invalid Date") && b.release_date.includes("TBA")) || 
      (!isNaN(b.release_date) && (new Date(b.release_date).toString() !== "Invalid Date") && a.release_date.includes("TBA"))){
        return -1
      }
      const dateA = new Date(a.release_date)
      const dateB = new Date(b.release_date)
      if(dateA === dateB) {
        return 0
      }
      if(dateA > dateB) {
        return -1
      }
      if(dateA < dateB) {
        return 1
      }
      return 0
    });
    return sortedItemsByReleaseDate
  } catch(error) {
    console.log(`utils.js sortReleaseDates error: ${error.message}`)
    return inputItems
  }
};



export const sortWatchedDates = (inputItems) => {
  if (!Array.isArray(inputItems) || inputItems.length < 2) {
    return inputItems
  }
  try {
    const sortedItemsByWatchedDate = inputItems.toSorted((a, b) => {

      if((a.watched_date === b.watched_date) || 
        (!a.watched_date && b.watched_date.includes("TBA")) || 
        (!b.watched_date && a.watched_date.includes("TBA"))) {
          return 0
        }
      if((!isNaN(a.watched_date) && (new Date(a.watched_date).toString() !== "Invalid Date") && b.watched_date.includes("TBA")) || 
      (!isNaN(b.watched_date) && (new Date(b.watched_date).toString() !== "Invalid Date") && a.watched_date.includes("TBA"))){
        return -1
      }
      const dateA = new Date(a.watched_date)
      const dateB = new Date(b.watched_date)
      if(dateA === dateB) {
        return 0
      }
      if(dateA > dateB) {
        return -1
      }
      if(dateA < dateB) {
        return 1
      }
      return 0
    });
    return sortedItemsByWatchedDate
  } catch(error) {
    console.log(`utils.js sortWatchedDates error: ${error.message}`)
    return inputItems
  }
};


export const validReleaseDateString = (release_date) => {
  // release_date can be an empty string, TBA, or ISO 8601 Format YYYY-MM-DD, YYYY-MM, or YYYY 
  if(!release_date || release_date.includes("TBA")) {
    return true;
  }
    if((new Date(release_date).toString() === "Invalid Date") || isNaN(new Date(release_date))) {
      return false;
    } else {
      return true;
    }
};


export const validWatchedDateString = (watched_date) => {
  // release_date can be an empty string or ISO 8601 Format YYYY-MM-DD, YYYY-MM, or YYYY 
  if(!watched_date) {
    return true;
  }
  if((new Date(watched_date).toString() === "Invalid Date") || isNaN(new Date(watched_date))) {
    return false;
  } else {
    return true;
  }
};
