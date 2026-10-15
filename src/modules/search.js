import { searchShows } from "./tvmaze.js";

// Tiempo de espera después de dejar de escribir antes de buscar
const DEBOUNCE_MS = 300;

// Cada sugerencia de la lista
const createSuggestionHTML = (show, index) => `
  <li class="suggestion" id="suggestion-${index}" role="option" data-index="${index}">
    <img src="${show.image}" alt="">
    <span class="suggestion-name">${show.name}</span>
    <span class="suggestion-meta">${show.year ?? "Sin fecha"} · ID ${show.id}</span>
  </li>
`;

// Conecta el formulario: sugerencias mientras se escribe y búsqueda al enviar.
// onSearch recibe un nombre o un ID.
export const setupSearch = ($form, onSearch) => {
  const $input = $form.elements.query;
  const $list = $form.querySelector(".suggestions");

  let results = [];
  let active = -1;
  let timer;
  let lastRequest = 0;

  const close = () => {
    $list.hidden = true;
    active = -1;
    $input.setAttribute("aria-expanded", "false");
    $input.removeAttribute("aria-activedescendant");
  };

  const highlight = (index) => {
    active = index;
    $list.querySelectorAll(".suggestion").forEach(($item, i) => {
      $item.classList.toggle("active", i === index);
    });

    const $active = $list.querySelector(".suggestion.active");
    $active?.scrollIntoView({ block: "nearest" });
    $input.setAttribute("aria-activedescendant", $active?.id ?? "");
  };

  const render = () => {
    const html = results.length > 0
      ? results.map(createSuggestionHTML).join("")
      : `<li class="suggestion-empty">Sin resultados</li>`;

    $list.setHTMLUnsafe(html);
    $list.hidden = false;
    active = -1;
    $input.setAttribute("aria-expanded", "true");
  };

  const select = (show) => {
    $input.value = show.name;
    close();
    onSearch(show.id);
  };

  // Buscar mientras se escribe
  $input.addEventListener("input", () => {
    clearTimeout(timer);
    const query = $input.value.trim();

    if (query === "") {
      lastRequest++;   // ignora respuestas pendientes
      return close();
    }

    timer = setTimeout(async () => {
      const request = ++lastRequest;
      const found = await searchShows(query).catch(() => []);

      // Si llegó una respuesta de una búsqueda anterior, se descarta
      if (request !== lastRequest) return;

      results = found.slice(0, 8);
      render();
    }, DEBOUNCE_MS);
  });

  // Navegar la lista con el teclado
  $input.addEventListener("keydown", (event) => {
    if ($list.hidden || results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      highlight((active + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      highlight((active - 1 + results.length) % results.length);
    } else if (event.key === "Enter" && active >= 0) {
      event.preventDefault();
      select(results[active]);
    } else if (event.key === "Escape") {
      close();
    }
  });

  // Elegir una sugerencia con el mouse
  $list.addEventListener("click", (event) => {
    const $item = event.target.closest(".suggestion");
    if ($item) select(results[$item.dataset.index]);
  });

  // Cerrar la lista al hacer clic fuera del buscador
  document.addEventListener("click", (event) => {
    if (!$form.contains(event.target)) close();
  });

  // Buscar con el botón o con Enter
  $form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearTimeout(timer);
    lastRequest++;
    close();

    const query = $input.value.trim();
    if (query !== "") onSearch(query);
  });
};
