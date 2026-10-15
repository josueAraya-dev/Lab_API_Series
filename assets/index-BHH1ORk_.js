(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://placehold.co/210x295`,t=async t=>{let n=`https://api.tvmaze.com/shows/${t}`,r=await fetch(n);if(!r.ok)throw Error(`No existe una serie con el ID ${t}`);let i=await r.json();return{name:i.name,rating:i.rating,image:i.image?.medium??e}},n=e=>/^\d+$/.test(e),r=t=>({id:t.id,name:t.name,year:t.premiered?.slice(0,4),image:t.image?.medium??e}),i=async e=>{let t=`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(e)}`,[i,a]=await Promise.all([fetch(t).then(e=>e.json()),n(e)?fetch(`https://api.tvmaze.com/shows/${e}`).then(e=>e.ok?e.json():null):null]),o=i.map(({show:e})=>r(e));return a?[r(a),...o.filter(e=>e.id!==a.id)]:o},a=async e=>{if(n(e))return e;let[t]=await i(e);if(!t)throw Error(`No se encontraron series para "${e}"`);return t.id},o=async e=>{let t=`https://api.tvmaze.com/shows/${e}/episodes`,n=(await fetch(t).then(e=>e.json())).map(e=>({number:e.number,name:e.name,season:e.season,rating:e.rating.average}));return Object.groupBy(n,e=>e.season)},s=e=>e==null?`rating-none`:`rating-${Math.floor(e)}`,c=e=>{let t=e.map(e=>e.rating).filter(e=>e!=null);if(t.length===0)return null;let n=t.reduce((e,t)=>e+t,0);return Math.round(n/t.length*10)/10},l=e=>`
  <div class="rating-bar">
    <div class="rating-fill ${s(e)}" style="width: ${(e??0)*10}%"></div>
  </div>
  <span class="rating-value ${s(e)}">${e??`-`}</span>
`,u=e=>`
  <img class="poster" src="${e.image}" alt="${e.name}">
  <h1>${e.name}</h1>
  <span class="show-rating ${s(e.rating.average)}">${e.rating.average??`-`}</span>
`,d=e=>`
  <li class="episode">
    <span class="episode-number">E${e.number??`-`}</span>
    <span class="episode-name" title="${e.name}">${e.name}</span>
    ${l(e.rating)}
  </li>
`,f=(e,t)=>`
  <details class="season" ${t===1?`open`:``}>
    <summary class="season-summary">
      <span class="season-title">Temporada ${t}</span>
      <span class="season-count">${e.length} ${e.length===1?`episodio`:`episodios`}</span>
      ${l(c(e))}
    </summary>
    <ol class="episode-list">
      ${e.map(d).join(``)}
    </ol>
  </details>
`,p=(e,t)=>{let n=document.querySelector(`.content header`),r=document.querySelector(`.content .episodes`);n.setHTMLUnsafe(u(e));let i=Object.values(t).map((e,t)=>f(e,t+1));r.setHTMLUnsafe(i.join(``))},m=300,h=(e,t)=>`
  <li class="suggestion" id="suggestion-${t}" role="option" data-index="${t}">
    <img src="${e.image}" alt="">
    <span class="suggestion-name">${e.name}</span>
    <span class="suggestion-meta">${e.year??`Sin fecha`} · ID ${e.id}</span>
  </li>
`,g=(e,t)=>{let n=e.elements.query,r=e.querySelector(`.suggestions`),a=[],o=-1,s,c=0,l=()=>{r.hidden=!0,o=-1,n.setAttribute(`aria-expanded`,`false`),n.removeAttribute(`aria-activedescendant`)},u=e=>{o=e,r.querySelectorAll(`.suggestion`).forEach((t,n)=>{t.classList.toggle(`active`,n===e)});let t=r.querySelector(`.suggestion.active`);t?.scrollIntoView({block:`nearest`}),n.setAttribute(`aria-activedescendant`,t?.id??``)},d=()=>{let e=a.length>0?a.map(h).join(``):`<li class="suggestion-empty">Sin resultados</li>`;r.setHTMLUnsafe(e),r.hidden=!1,o=-1,n.setAttribute(`aria-expanded`,`true`)},f=e=>{n.value=e.name,l(),t(e.id)};n.addEventListener(`input`,()=>{clearTimeout(s);let e=n.value.trim();if(e===``)return c++,l();s=setTimeout(async()=>{let t=++c,n=await i(e).catch(()=>[]);t===c&&(a=n.slice(0,8),d())},m)}),n.addEventListener(`keydown`,e=>{r.hidden||a.length===0||(e.key===`ArrowDown`?(e.preventDefault(),u((o+1)%a.length)):e.key===`ArrowUp`?(e.preventDefault(),u((o-1+a.length)%a.length)):e.key===`Enter`&&o>=0?(e.preventDefault(),f(a[o])):e.key===`Escape`&&l())}),r.addEventListener(`click`,e=>{let t=e.target.closest(`.suggestion`);t&&f(a[t.dataset.index])}),document.addEventListener(`click`,t=>{e.contains(t.target)||l()}),e.addEventListener(`submit`,e=>{e.preventDefault(),clearTimeout(s),c++,l();let r=n.value.trim();r!==``&&t(r)})},_=document.querySelector(`.search`),v=document.querySelector(`.error`),y=0,b=async e=>{let n=++y;v.hidden=!0;try{let r=await a(String(e)),i=await t(r),s=await o(r);if(n!==y)return;p(i,s)}catch(e){if(n!==y)return;v.textContent=e.message,v.hidden=!1}};g(_,b),b(`67 `);