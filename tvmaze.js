"use strict";

const TV_MAZE_SEARCH_URL = "https://api.tvmaze.com/search/shows?";
const MISSING_IMAGE_REPLACEMENT = "https://tinyurl.com/tv-missing"; 

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

async function getShowsByTerm(keyword) {
  const searchResults = await axios.get(TV_MAZE_SEARCH_URL, { params: { q: keyword } });
  const showList = searchResults.data;
  return showList.map(show => getShowInformation(show));
}

/** Gets information for an individual show from the axios object that is pulled from the keyword.
 * returns an information (id, name, summary, image) stored as an object.
 */
function getShowInformation(show) {

  const showID = show.show.id
  const showName = show.show.name;
  let showSummary = (show.show.summary === null) ? "No Summary found": show.show.summary;
  let showImage = (show.show.image === null) ? MISSING_IMAGE_REPLACEMENT: show.show.image.medium;

  return {
    "id": showID,
    "name": showName,
    "summary": showSummary,
    "image": showImage
  };

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
             <button class="btn btn-outline-light btn-sm Show-getEpisodes" id="episodes-btn">
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

async function getEpisodesOfShow(id) { 
  const episodesData = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  console.log(episodesData);
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { }

async function clickCallBack(evt) {
  evt.preventDefault();

  console.log(evt.target.parent);
  console.log($(show).getAttribute('data-show-id'));
  // await getEpisodesOfShow(this.id);

}


$("#showsList").on("click", "#episodes-btn", clickCallBack);
// when you push a button
// use API to get episodes
// display episodes in a list