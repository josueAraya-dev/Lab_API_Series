// Serie que se muestra al abrir la página
export const DEFAULT_ID = "7676";
const PLACEHOLDER_IMAGE = "https://placehold.co/210x295";

// Obtener datos de una serie por su ID
export const getShowData = async (id) => {
  const URL = `https://api.tvmaze.com/shows/${id}`;
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`No existe una serie con el ID ${id}`);
  const data = await res.json();

  return {
    name: data.name,
    rating: data.rating,
    image: data.image?.medium ?? PLACEHOLDER_IMAGE
  };
};

const isId = (query) => /^\d+$/.test(query);

// Datos mínimos de una serie para la lista de sugerencias
const toSuggestion = (show) => ({
  id: show.id,
  name: show.name,
  year: show.premiered?.slice(0, 4),
  image: show.image?.medium ?? PLACEHOLDER_IMAGE
});

// Buscar series por nombre (y por ID si lo escrito es un número)
export const searchShows = async (query) => {
  const URL = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`;

  const [results, showById] = await Promise.all([
    fetch(URL).then(res => res.json()),
    isId(query)
      ? fetch(`https://api.tvmaze.com/shows/${query}`).then(res => res.ok ? res.json() : null)
      : null
  ]);

  const shows = results.map(({ show }) => toSuggestion(show));
  if (!showById) return shows;

  // La serie con ese ID va primero, sin repetirla
  return [toSuggestion(showById), ...shows.filter(show => show.id !== showById.id)];
};

// Convierte lo escrito (nombre o ID) en el ID de una serie
export const findShowId = async (query) => {
  if (isId(query)) return query;

  const [first] = await searchShows(query);
  if (!first) throw new Error(`No se encontraron series para "${query}"`);
  return first.id;
};

// Obtener episodios agrupados por temporada
export const getEpisodeList = async (id) => {
  const URL = `https://api.tvmaze.com/shows/${id}/episodes`;
  const episodes = await fetch(URL).then(res => res.json());

  const episodeList = episodes.map(episode => ({
    number: episode.number,
    season: episode.season,
    rating: episode.rating.average
  }));

  const episodesBySeason = Object.groupBy(episodeList, (episode) => episode.season);
  return episodesBySeason;
};
