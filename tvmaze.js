"use strict";

const TV_MAZE_SEARCH_URL = "https://api.tvmaze.com/search/shows?";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const searchTerm = $("#searchForm-term").val();

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

// use keyword, to match name of show
// pull information for show
// append and display on html

async function getShowsByTerm(keyword) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  const axiosObj = await axios.get(TV_MAZE_SEARCH_URL, { params: { q: keyword } });

  return axiosObj.data.map(idx => getShowInformation(idx));
}

function getShowInformation(show) {

  const showID = show.show.id
  const showName = show.show.name;
  const showSummary = show.show.summary;
  let showImage;

  if (show.show.image === undefined) {
    showImage = "https://tinyurl.com/tv-missing";
  } else {
    showImage = show.show.image.original;
  }

  return {
    id: showID,
    name: showName,
    summary: showSummary,
    image: showImage
  }

}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="Bletchly Circle San Francisco" 
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
