// Clase de color según la valoración (rating-0 ... rating-10)
const getRatingClass = (rating) =>
  rating == null ? "rating-none" : `rating-${Math.floor(rating)}`;

// Datos de la serie
export const createHeaderHTML = (show) => `
  <img class="poster" src="${show.image}" alt="${show.name}">
  <h1>${show.name}</h1>
  <span class="show-rating ${getRatingClass(show.rating.average)}">${show.rating.average ?? "-"}</span>
`;

// Cada episodio
export const createEpisodeHTML = (episode) => `
  <div class="episode ${getRatingClass(episode.rating)}" title="T${episode.season} E${episode.number}">
    ${episode.rating ?? "-"}
  </div>
`;

// Cada temporada (data = array de episodios, number = temporada)
export const createSeasonHTML = (data, number) => `
  <article class="season">
    <span class="season-number">T${number}</span>
    <div class="season-episodes">
      ${data.map(createEpisodeHTML).join("")}
    </div>
  </article>
`;

// Pinta la serie y sus temporadas en el DOM
export const renderShow = (show, seasons) => {
  const $header = document.querySelector(".content header");
  const $episodes = document.querySelector(".content .episodes");

  $header.setHTMLUnsafe(createHeaderHTML(show));

  // Recorre cada temporada y llama a createSeasonHTML
  const list = Object.values(seasons).map((season, index) => createSeasonHTML(season, index + 1));
  $episodes.setHTMLUnsafe(list.join(""));
};
