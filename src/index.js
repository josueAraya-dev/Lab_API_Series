import { DEFAULT_ID, findShowId, getShowData, getEpisodeList } from "./modules/tvmaze.js";
import { renderShow } from "./modules/render.js";
import { setupSearch } from "./modules/search.js";

const $form = document.querySelector(".search");
const $error = document.querySelector(".error");

let lastLoad = 0;

// Busca la serie (por nombre o ID) y la pinta en el DOM
const loadShow = async (query) => {
  const load = ++lastLoad;
  $error.hidden = true;

  try {
    const id = await findShowId(String(query));
    const show = await getShowData(id);         // { name, rating, image }
    const seasons = await getEpisodeList(id);   // { 1: [ { number, season, rating }, ... ], 2: ... }

    // Si mientras tanto se buscó otra serie, no se pinta esta
    if (load !== lastLoad) return;
    renderShow(show, seasons);
  } catch (error) {
    if (load !== lastLoad) return;
    $error.textContent = error.message;
    $error.hidden = false;
  }
};

setupSearch($form, loadShow);
loadShow(DEFAULT_ID);
