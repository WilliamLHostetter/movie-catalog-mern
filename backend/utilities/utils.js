
export const filterUpcomingShows = (allItems) => {
  let upcomingShows = []
  if(allItems.length > 0) {
    const currentDate = new Date();
    let release_date;
    for (let item of allItems) {
      if (('release_date' in item) && item.release_date) {
        if(item.release_date.includes("TBD") || item.release_date.includes("TBA")){
          upcomingShows.push(item);
        } else {
          try {
            release_date = new Date(item.release_date)
            console.assert(release_date instanceof Date && !isNaN(release_date), `Invalid release date string (${item.release_date}) for ${item.title}`)
            if(release_date > currentDate){
              upcomingShows.push(item);
            }
          } catch (err) {
            console.log("utils.js filterUpcomingShows error = " + err)
          }
        }
      };
    };
  };
  return upcomingShows;
}