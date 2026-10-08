// Favicon animé : l'étoile scintille et la porte s'éclaire, puis repos.
// Chrome, Edge et Firefox affichent l'animation ; Safari garde l'icône fixe (il n'utilise pas les favicons SVG).
// L'animation s'arrête quand l'onglet est en arrière-plan et respecte « réduire les animations ».
// `dessinerFavicon` est injectée par le build depuis src/illustrations/favicon.js.
function initialiserFavicon() {
  const lien = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
  if (!lien || !window.matchMedia || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const DUREE = 1600;        // durée du scintillement (ms)
  const PAUSE = 4500;        // repos entre deux scintillements (ms)
  const IMAGES_PAR_SEC = 24; // suffisant pour une icône de 16 px, et très léger
  const repos = lien.href;
  const lisser = t => (1 - Math.cos(Math.PI * t)) / 2;
  let minuterie = 0;

  const afficher = svg => { lien.href = `data:image/svg+xml,${encodeURIComponent(svg)}`; };

  function jouer() {
    const debut = performance.now();
    (function image() {
      if (document.hidden) return;
      const t = Math.min(1, (performance.now() - debut) / DUREE);
      afficher(dessinerFavicon(lisser(t), Math.sin(Math.PI * t)));
      if (t < 1) minuterie = setTimeout(image, 1000 / IMAGES_PAR_SEC);
      else { lien.href = repos; minuterie = setTimeout(jouer, PAUSE); }
    })();
  }

  document.addEventListener('visibilitychange', () => {
    clearTimeout(minuterie);
    lien.href = repos;
    if (!document.hidden) minuterie = setTimeout(jouer, 600);
  });
  minuterie = setTimeout(jouer, 800);
}
